using CityPalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;

namespace CityPalAPI.Controllers;
[ApiController]
[Route("[controller]")]
public class ReviewsController
{
    private readonly ILogger<PlacesController> logger;
    private readonly IBoltGraphClient graphClient;

    public ReviewsController(ILogger<PlacesController> logger, IBoltGraphClient graphClient)
    {
        this.logger = logger;
        this.graphClient = graphClient;
    }

    [HttpGet("/Reviews/Persons/{personId}")]
    public async Task<IEnumerable<Review>> PersonPlaceReviews(string personId)
    {
        var res = await graphClient.Cypher
           .Match("(p)-[r:REVIEWED]->(pl)")
           .Where((Person p) => p.Id == personId)
           .Return<Review>("r").ResultsAsync;

        return res;
    }

    [HttpPost("/Reviews/Places")]
    public async Task CreatePlaceReview(Review rating)
    {
        // TODO: Prevent create if already exists

        var cypher = graphClient.Cypher
           .Match("(p:Person)")
           .With("p")
           .Match("(pl:Place)")
           .Where((Person p) => p.Id == rating.PersonId)
           .AndWhere((Place pl) => pl.Id == rating.PlaceId)
           .Create("(p)-[r:REVIEWED $relParams]->(pl)")
           .WithParam("relParams", new Review
           {
               PersonId = rating.PersonId,
               PlaceId = rating.PlaceId,
               Rating = rating.Rating,
               Comment = rating.Comment
           });

        logger.LogInformation(cypher.Query.DebugQueryText);

        await cypher.ExecuteWithoutResultsAsync();
    }

    [HttpPut("/Reviews/Places")]
    public async Task UpdatePlaceReview(Review rating)
    {
        var cypher = graphClient.Cypher
           .Match("(p:Person)")
           .With("p")
           .Match("(pl:Place)")
           .Where((Person p) => p.Id == rating.PersonId)
           .AndWhere((Place pl) => pl.Id == rating.PlaceId)
           .Set("(p)-[r:REVIEWED $relParams]->(pl)")
           .WithParam("relParams", new { rating.Rating, rating.Comment });

        logger.LogInformation(cypher.Query.DebugQueryText);

        await cypher.ExecuteWithoutResultsAsync();
    }

    [HttpDelete("/Reviews/Places/{personId}/{placeId}")]
    public async Task DeletePlaceReview(string PersonId, string PlaceId)
    {
        var cypher = graphClient.Cypher
           .Match("(p)-[r:REVIEWED]->(pl)")
           .Where((Person p) => p.Id == PersonId)
           .AndWhere((Place pl) => pl.Id == PlaceId)
           .Delete("r");

        logger.LogInformation(cypher.Query.DebugQueryText);

        await cypher.ExecuteWithoutResultsAsync();
    }

    [HttpGet("/Reviews/Places/{placeId}")]
    public async Task<IEnumerable<Review>> AllReviews(string placeId)
    {
        var cypher = graphClient.Cypher
           .Match("(p:Person)-[r:REVIEWED]->(pl:Place)")
           .Where((Place pl) => pl.Id == placeId)
           .Return<Review>("r");

        logger.LogInformation(cypher.Query.DebugQueryText);

        return await cypher.ResultsAsync;
    }
}
