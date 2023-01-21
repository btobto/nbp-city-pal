using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace CityPalAPI.Validators;

public class ErrorResponse : ValidationProblemDetails
{

    public ErrorResponse(string title, HttpStatusCode httpStatusCode, IDictionary<string, string[]> errors) : base(errors)
    {
        this.Title = title;
        this.Status = (int)httpStatusCode;
    }
}
