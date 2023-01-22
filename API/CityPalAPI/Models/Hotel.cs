using System.Text.Json.Serialization;

namespace CityPalAPI.Models;

[JsonDerivedType(typeof(Hotel), nameof(Hotel))]
public class Hotel : Place
{
    public int Stars { get; set; }
}
