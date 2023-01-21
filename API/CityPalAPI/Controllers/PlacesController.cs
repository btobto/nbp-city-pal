using CityPalAPI.DataTypes;
using CityPalAPI.Models;
using CityPalAPI.TransferModels;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using Neo4jClient.ReturnPoly;

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

    [HttpPost("Search/{name}")]
    public async Task<IEnumerable<Place>> Search(string name, [FromBody] string[] searchParams)
    {
        name = name.Trim().ToLower();

        if (searchParams.Length == 0)
        {
            var cypherWithoutParams = graphClient.Cypher
                .Match("(p:Place")
                .Where((Place p) => p.Name.StartsWith(name))
                .Return<Place>("p");

            logger.LogInformation(cypherWithoutParams.Query.DebugQueryText);

            return await cypherWithoutParams.ResultsAsync;
        }

        var cypher = graphClient.Cypher
            .Match($"(p:{searchParams[0]})")
            .Where((Place p) => p.Name.StartsWith(name))
            .Return<Place>("p");

        for (int i = 1; i < searchParams.Length; i++)
        {
            cypher = cypher
                        .Union()
                        .Match($"(p:{searchParams[i]})")
                        .Where((Place p) => p.Name.StartsWith(name))
                        .Return<Place>("p");
        }

        logger.LogInformation(cypher.Query.DebugQueryText);

        return await cypher.ResultsAsync;

    }

    [HttpPost("Recommended/{personId}")]
    public async Task<IEnumerable<Place>> RecommendedPlaces(string personId, [FromBody] Point location)
    {
        var cypher = graphClient.Cypher
           .Match(
                "(p:Person)",
                "(p)-[:FRIENDS_WITH]->(friend)",
                "(p)-[:LOCATED_IN]->(l:Location)",
                "(place:Place)-[:LOCATED_IN]->(l)",
                "(friend)-[r:REVIEWED]->(place)")
           .OptionalMatch(
                "(:Person)-[r2:REVIEWED]->(place)"
            )
           .Where((Person p) => p.Id == personId)
           .AndWhere((Review r) => r.Rating > 2.5)
           .With("avg(r2.Rating) as ratingAverage, place")
           .Set("place.Rating = ratingAverage")
           .With($"point.distance(point({{srId: 4326, x: {location.X}, y: {location.Y}}}), place.Location) as distance, place")
           .Set("place.Distance = distance")
           .ReturnPolymorphic<Place>("place")
           .OrderBy("distance");

        logger.LogInformation(cypher.Query.DebugQueryText);

        var res = await cypher.ResultsAsync;

        return res;
    }
}
