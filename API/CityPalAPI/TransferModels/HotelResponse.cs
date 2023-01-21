using CityPalAPI.TransferModels;

namespace CityPalAPI.Models;

public class HotelResponse : PlaceResponse
{
    public int Stars { get; set; }
}
