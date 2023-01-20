namespace CityPalAPI.Models;

public class Place
{
    public string id { get; set; } = default!;

    public string Name { get; set; } = default!;

    public string Address { get; set; } = default!;

    public double Rating { get; set; }

    public string WorkingHours { get; set; } = default!;
}
