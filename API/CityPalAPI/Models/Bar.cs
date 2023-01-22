using System.Text.Json.Serialization;

namespace CityPalAPI.Models;

[JsonDerivedType(typeof(Bar), nameof(Bar))]
public class Bar : Place
{
}
