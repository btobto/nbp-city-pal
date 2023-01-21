using CityPalAPI.TransferModels;
using FluentValidation;

namespace CityPalAPI.Validators;

public class RegisterValidator : AbstractValidator<RegisterModel>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name cannot be empty")
                .MinimumLength(3).WithMessage("Name must be at least 3 letters long.")
                .Must(name => name.All(char.IsLetter)).WithMessage("Name can be letters only.");

        RuleFor(x => x.Email)
              .NotEmpty().WithMessage("Email cannot be empty.")
              .EmailAddress().WithMessage("Email is not valid.");
    }
}
