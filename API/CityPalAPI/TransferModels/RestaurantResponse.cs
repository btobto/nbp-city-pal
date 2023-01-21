using CityPalAPI.TransferModels;

namespace CityPalAPI.Models;

public class RestaurantResponse : PlaceResponse
{
    public bool HasTakeout { get; set; }

    public string[] FoodTypes { get; set; } = default!;
}
