using CityPalAPI.TransferModels;

namespace CityPalAPI.Models;

public class GymResponse : PlaceResponse
{
    public int MembershipPrice { get; set; }
}
