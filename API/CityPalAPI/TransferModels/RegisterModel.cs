namespace CityPalAPI.TransferModels;

public class RegisterModel
{
    public string Name { get; set; } = default!;

    public string Email { get; set; } = default!;

    public string CityId { get; set; } = default!;
}