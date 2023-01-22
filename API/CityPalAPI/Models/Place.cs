using CityPalAPI.DataTypes;
using CityPalAPI.JsonConverters;
using System.Text.Json.Serialization;

namespace CityPalAPI.Models;

[JsonPolymorphic]
[JsonDerivedType(typeof(Bar), nameof(Bar))]
[JsonDerivedType(typeof(Gym), nameof(Gym))]
[JsonDerivedType(typeof(Hotel), nameof(Hotel))]
[JsonDerivedType(typeof(Restaurant), nameof(Restaurant))]
[JsonDerivedType(typeof(Cinema), nameof(Cinema))]
public abstract class Place
{
    public string Id { get; set; } = default!;

    public string Name { get; set; } = default!;

    public string Address { get; set; } = default!;

    public Point Location { get; set; } = default!;

    public float Rating { get; set; }

    public float Distance { get; set; }


    [Newtonsoft.Json.JsonConverter(typeof(TimeOnlyArrayJsonConverter))]
    public TimeOnly[] OpeningHours { get; set; } = new TimeOnly[7];

    [Newtonsoft.Json.JsonConverter(typeof(TimeOnlyArrayJsonConverter))]
    public TimeOnly[] ClosingHours { get; set; } = new TimeOnly[7];
}
