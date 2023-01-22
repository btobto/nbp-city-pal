using System.Text.Json.Serialization;

namespace CityPalAPI.Models;

[JsonDerivedType(typeof(Gym), nameof(Gym))]
public class Gym : Place
{
    public int MembershipPrice { get; set; }
}
