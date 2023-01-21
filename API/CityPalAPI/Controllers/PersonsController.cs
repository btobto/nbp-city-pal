using CityPalAPI.Models;
using CityPalAPI.TransferModels;
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

    [HttpPost("{name}/{email}")]
    public async Task<Person> Create(string name, string email)
    {
        Person p = new Person
        {
            Id = Guid.NewGuid().ToString(),
            Name = name,
            Email = email
        };

        await graphClient.Cypher
           .Merge("(p:Person { Email: $email })")
           .OnCreate()
           .Set("p = $person")
           .WithParams(new
           {
               email,
               person = p
           })
           .ExecuteWithoutResultsAsync();

        return p;
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
}
