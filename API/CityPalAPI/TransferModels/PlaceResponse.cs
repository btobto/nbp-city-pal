using CityPalAPI.Models;
using System.Text.Json.Serialization;

namespace CityPalAPI.TransferModels;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "$discriminator")]
[JsonDerivedType(typeof(BarResponse), nameof(Bar))]
[JsonDerivedType(typeof(GymResponse), nameof(Gym))]
[JsonDerivedType(typeof(HotelResponse), nameof(Hotel))]
[JsonDerivedType(typeof(RestaurantResponse), nameof(Restaurant))]
[JsonDerivedType(typeof(CinemaResponse), nameof(Cinema))]
public class PlaceResponse : Place
{
    public float Rating { get; set; }

    public float Distance { get; set; }
}
