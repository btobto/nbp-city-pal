using System.Text.Json.Serialization;

namespace CityPalAPI.Models;

[JsonDerivedType(typeof(Restaurant), nameof(Restaurant))]
public class Restaurant : Place
{
    public bool HasTakeout { get; set; }

    public string[] FoodTypes { get; set; } = default!;
}
