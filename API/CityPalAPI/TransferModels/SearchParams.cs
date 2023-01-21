using CityPalAPI.DataTypes;

namespace CityPalAPI.TransferModels;

public class SearchParams
{
    public string[] PlaceTypes { get; set; } = default!;

    public Point Location { get; set; }
}
