namespace CityPalAPI.Models;

public class Restaurant : Place
{
    public bool HasTakeout { get; set; }

    public List<string> FoodTypes { get; set; } = default!;
}
