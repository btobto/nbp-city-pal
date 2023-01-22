using CityPalAPI.Models;
using CityPalAPI.TransferModels;
using CityPalAPI.Validators;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;

namespace CityPalAPI.Controllers;
[ApiController]
[Route("[controller]")]
public class PersonsController : ControllerBase
{
    private readonly ILogger<PersonsController> logger;
    private readonly IBoltGraphClient graphClient;

    public PersonsController(ILogger<PersonsController> logger, IBoltGraphClient graphClient)
    {
        this.logger = logger;
        this.graphClient = graphClient;
    }

    [HttpGet("Login/{email}")]
    public async Task<IActionResult> Login(string email)
    {
        var cypher = graphClient.Cypher
            .Match("(p:Person { Email: $email })")
            .WithParam("email", email)
            .Return<Person>("p");

        logger.LogInformation(cypher.Query.DebugQueryText);

        var results = await cypher.ResultsAsync;

        if (!results.Any())
        {
            return ValidationProblem(new ErrorResponse("Title", System.Net.HttpStatusCode.NotFound, new Dictionary<string, string[]>
            {
                {
                    nameof(email), new string[]{"Account with given email does not exist."}
                }
            }));
        }

        return Ok((await cypher.ResultsAsync).Single());
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Create(RegisterModel registerModel)
    {
        Person p = new Person
        {
            Id = Guid.NewGuid().ToString(),
            Name = registerModel.Name,
            Email = registerModel.Email
        };

        var cypher = graphClient.Cypher
           .OptionalMatch("(p:Person { Email: $email })")
           .WithParam("email", registerModel.Email)
           .Return<Person?>("p");

		if ((await cypher.ResultsAsync).First() != null)
        {
			return ValidationProblem(new ErrorResponse("Title", System.Net.HttpStatusCode.BadRequest, new Dictionary<string, string[]>
			{
				{
					nameof(p.Email), new string[]{"Account with given email already exists."}
				}
			}));
		}

        var cypher2 = graphClient.Cypher
            .Create("(p:Person)")
            .Set("p = $person")
            .WithParam("person", p)
            .Return<Person>("p");

		logger.LogInformation(cypher2.Query.DebugQueryText);

        return Ok((await cypher2.ResultsAsync).Single());
    }

    [HttpPost("Friends/{idFirst}/{idSecond}")]
    public async Task AddFriend(string idFirst, string idSecond)
    {
        await graphClient.Cypher
        .Match("(p1:Person)", "(p2:Person)")
        .Where((Person p1) => p1.Id == idFirst)
        .AndWhere((Person p2) => p2.Id == idSecond)
        .Create("(p1)-[:FRIENDS_WITH]->(p2)")
        .ExecuteWithoutResultsAsync();
    }

    [HttpDelete("Friends/{idFirst}/{idSecond}")]
    public async Task RemoveFriend(string idFirst, string idSecond)
    {
        await graphClient.Cypher
        .Match("(p1:Person)-[r:FRIENDS_WITH]-(p2:Person)")
        .Where((Person p1) => p1.Id == idFirst)
        .AndWhere((Person p2) => p2.Id == idSecond)
        .Delete("r")
        .ExecuteWithoutResultsAsync();
    }

    [HttpGet("Search/{name}")]
    public async Task<IEnumerable<Person>> Search(string name)
    {
        name = name.Trim().ToLower();

        string dbCall = $"db.index.fulltext.queryNodes(\"person_name_index\", \"*{name}*\")";

        var cypher = graphClient.Cypher
            .Call(dbCall)
            .Yield("node")
            .Return<Person>("node");

        logger.LogInformation(cypher.Query.DebugQueryText);

        return await cypher.ResultsAsync;
    }

    [HttpGet("{id}")]
    public async Task<Person> GetPerson(string id)
    {
        var cypher = graphClient.Cypher
            .Match("(p:Person)")
            .Where((Person p) => p.Id == id)
            .Return<Person>("p");

		logger.LogInformation(cypher.Query.DebugQueryText);

		return (await cypher.ResultsAsync).Single();
	}

    [HttpGet("Friends/{id}")]
    public async Task<IEnumerable<Person>> GetPersonsFriends(string id)
    {
        var cypher = graphClient.Cypher
            .Match("(p:Person)-[:FRIENDS_WITH]->(friend:Person)")
            .Where((Person p) => p.Id == id)
            .Return<Person>("friend");

        logger.LogInformation(cypher.Query.DebugQueryText);

        return await cypher.ResultsAsync;
    }
}
