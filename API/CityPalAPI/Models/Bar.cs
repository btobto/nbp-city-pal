using System.Text.Json.Serialization;

namespace CityPalAPI.Models;

[JsonDerivedType(typeof(Cinema), nameof(Cinema))]
public class Bar : Place
{
}
