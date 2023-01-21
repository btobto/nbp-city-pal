namespace CityPalAPI.Models;

public class Review
{
    public string PersonId { get; set; } = default!;
    public string PlaceId { get; set; } = default!;
    public int Rating { get; set; }
    public string Comment { get; set; } = default!;
}
