using Microsoft.AspNetCore.Mvc;
using Neo4jClient;

namespace CityPalAPI.Controllers;
[ApiController]
[Route("[controller]")]
public class CityPalController : ControllerBase
{
    private readonly ILogger<CityPalController> logger;
    private readonly IBoltGraphClient graphClient;

    public CityPalController(ILogger<CityPalController> logger, IBoltGraphClient graphClient)
    {
        this.logger = logger;
        this.graphClient = graphClient;
    }

    [HttpGet("CityPalTest")]
    public List<string> Get()
    {
        return new List<string>();
    }
}
