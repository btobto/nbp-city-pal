using CityPalAPI.DataTypes;
using CityPalAPI.Models;
using CityPalAPI.TransferModels;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using Neo4jClient.Cypher;
using Neo4jClient.ReturnPoly;
using System.Numerics;
using System.Text.Json;

namespace CityPalAPI.Controllers;
[ApiController]
[Route("[controller]")]
public class PlacesController : ControllerBase
{
    private readonly ILogger<PlacesController> logger;
    private readonly IBoltGraphClient graphClient;

    public PlacesController(ILogger<PlacesController> logger, IBoltGraphClient graphClient)
    {
        this.logger = logger;
        this.graphClient = graphClient;
    }

    [HttpGet("{id}")]
    public async Task<Place> GetPlace(string id)
    {
        var cypher = graphClient.Cypher
            .Match("(place:Place)")
            .Where((Place place) => place.Id == id)
            .OptionalMatch("(:Person)-[r2:REVIEWED]->(place)")
            .Match("(place)-[:LOCATED_IN]->(c:City)")
            .With("avg(r2.Rating) as ratingAverage, place, c")
            .Set("place.Rating = ratingAverage")
            .Set("place.CityName = c.Name")
            .ReturnPolymorphic<Place>("place");

        logger.LogInformation(cypher.Query.DebugQueryText);

        var res = await cypher.ResultsAsync;

        return res.Single();
    }

    [HttpPost("Search/{name}")]
    public async Task<IEnumerable<Place>> Search(string name, [FromBody] SearchParams searchParams)
    {
        name = name.Trim().ToLower();

        string dbCall = $"db.index.fulltext.queryNodes(\"place_name_index\", \"*{name}*\")";

        ICypherFluentQuery cypher;

        if (searchParams.PlaceTypes.Length == 0)
        {
            cypher = graphClient.Cypher
                .Call(dbCall)
                .Yield("node");
        }
        else
        {
            cypher = graphClient.Cypher
                    .Call(dbCall)
                    .Yield("node")
                    .Where($"\"{searchParams.PlaceTypes[0]}\" IN LABELS(node)");

            for (int i = 1; i < searchParams.PlaceTypes.Length; i++)
            {
                cypher = cypher
                    .OrWhere($"\"{searchParams.PlaceTypes[i]}\" IN LABELS(node)");
            }
        }

        var cypherReturnPoly = cypher
            .Match("(node)-[:LOCATED_IN]->(c:City)")
            .Set("node.CityName = c.Name")
            .ReturnPolymorphic<Place>("node")
            .Limit(10);

        var places = (await cypherReturnPoly.ResultsAsync).ToList();

        ICypherFluentQuery<float> distancesCypher = cypher
           .With($"node, point.distance(point({{srId: 4326, x: {searchParams.Location.X}, y: {searchParams.Location.Y}}}), node.Location) as distance")
           .Return<float>("distance")
           .OrderBy("distance")
           .Limit(10);

        logger.LogInformation(cypherReturnPoly.Query.DebugQueryText);
        logger.LogInformation(distancesCypher.Query.DebugQueryText);

        var distances = (await distancesCypher.ResultsAsync).ToList();

        for (int i = 0; i < places.Count; i++)
        {
            places[i].Distance = distances[i];
        }

        return places;
    }

    [HttpPost("Recommended/{personId}")]
    public async Task<IEnumerable<Place>> RecommendedPlaces(string personId, [FromBody] Point location)
    {
        logger.LogInformation(location.ToString());

        var cypher = graphClient.Cypher
           .Match(
                "(p:Person)",
                "(p)-[:FRIENDS_WITH]->(friend)",
                "(p)-[:LOCATED_IN]->(c:City)",
                "(place:Place)-[:LOCATED_IN]->(c)",
                "(friend)-[r:REVIEWED]->(place)")
           .OptionalMatch(
                "(:Person)-[r2:REVIEWED]->(place)"
            )
           .Where((Person p) => p.Id == personId)
           .AndWhere((Review r) => r.Rating > 2.5)
           .With("c, avg(r2.Rating) as ratingAverage, place")
           .Set("place.CityName = c.Name")
           .Set("place.Rating = ratingAverage");


        var cypherReturnPoly = cypher.ReturnPolymorphic<Place>("place")
            .Limit(10);

        var places = (await cypherReturnPoly.ResultsAsync).ToList();

        ICypherFluentQuery<float> distancesCypher = cypher
           .With($"place, point.distance(point({{srId: 4326, x: {location.X}, y: {location.Y}}}), place.Location) as distance")
           .Return<float>("distance")
           .OrderBy("distance")
           .Limit(10);

        logger.LogInformation(cypherReturnPoly.Query.DebugQueryText);
        logger.LogInformation(distancesCypher.Query.DebugQueryText);

        var distances = (await distancesCypher.ResultsAsync).ToList();

        for (int i = 0; i < places.Count; i++)
        {
            places[i].Distance = distances[i];
        }

        return places;
    }

    [HttpGet("/Cities")]
    public async Task<IEnumerable<City>> GetCities()
    {
        var cypher = graphClient.Cypher
            .Match("(c:City)")
            .Return<City>("c");

        logger.LogInformation(cypher.Query.DebugQueryText);

        var res = await cypher.ResultsAsync;

        return res;

    }
}
