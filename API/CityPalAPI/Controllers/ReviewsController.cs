using CityPalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;

namespace CityPalAPI.Controllers;
[ApiController]
[Route("[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly ILogger<PlacesController> logger;
    private readonly IBoltGraphClient graphClient;

    public ReviewsController(ILogger<PlacesController> logger, IBoltGraphClient graphClient)
    {
        this.logger = logger;
        this.graphClient = graphClient;
    }

    [HttpGet("/Reviews/Persons/{personId}")]
    public async Task<IEnumerable<Review>> PersonsReviews(string personId)
    {
        var cypher = graphClient.Cypher
           .Match("(p:Person)-[r:REVIEWED]->(pl:Place)")
           .Where((Person p) => p.Id == personId)
           .Return<Review>("r");

        logger.LogInformation(cypher.Query.DebugQueryText);

        return await cypher.ResultsAsync;
    }

    [HttpPost("/Reviews/Places")]
    public async Task<IActionResult> CreatePlaceReview(Review review)
    {
        var cypher = graphClient.Cypher
           .Match("(p:Person)-[r:REVIEWED]->(pl:Place)")
           .Where((Person p) => p.Id == review.PersonId)
           .AndWhere((Place pl) => pl.Id == review.PlaceId)
           .AndWhere((Review r) => r.PersonId == review.PersonId && r.PlaceId == review.PlaceId)
           .Return<Review>("r");

        logger.LogInformation(cypher.Query.DebugQueryText);

        var cypherResults = await cypher.ResultsAsync;

        // If exists, update
        if (cypherResults.Any())
        {
            return Ok(await UpdatePlaceReview(review));
        }

        // Else, create
        var createCypher = graphClient.Cypher
           .Match("(p:Person)")
           .With("p")
           .Match("(pl:Place)")
           .Where((Person p) => p.Id == review.PersonId)
           .AndWhere((Place pl) => pl.Id == review.PlaceId)
           .Create("(p)-[r:REVIEWED $relParams]->(pl)")
           .WithParam("relParams", review)
           .Return<Review>("r");

        logger.LogInformation(createCypher.Query.DebugQueryText);

        return Ok((await createCypher.ResultsAsync).Single());
    }

    [HttpPut("/Reviews/Places")]
    public async Task<Review> UpdatePlaceReview(Review review)
    {
        var cypher = graphClient.Cypher
           .Match("(p:Person)-[r:REVIEWED]->(pl:Place)")
           .Where((Person p) => p.Id == review.PersonId)
           .AndWhere((Place pl) => pl.Id == review.PlaceId)
           .AndWhere((Review r) => r.PersonId == review.PersonId && r.PlaceId == review.PlaceId)
           .Set("r = $relParams")
           .WithParam("relParams", review)
           .Return<Review>("r");

        logger.LogInformation(cypher.Query.DebugQueryText);

        return (await cypher.ResultsAsync).Single();
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
