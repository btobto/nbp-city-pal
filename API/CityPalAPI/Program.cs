using CityPalAPI.Models;
using CityPalAPI.TransferModels;
using CityPalAPI.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Neo4jClient;
using Neo4jClient.ReturnPoly;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"))
    .AddConsole()
    .AddDebug();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddScoped<IValidator<RegisterModel>, RegisterValidator>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSDevelopment", builder =>
    {
        builder.WithOrigins(
                "http://localhost:5500",
                "https://localhost:5500",
                "http://127.0.0.1:5500",
                "https://127.0.0.1:5500",
                "http://localhost:8000",
                "https://localhost:8000",
                "http://127.0.0.1:8000",
                "https://127.0.0.1:8000",
                "http://localhost:4200",
                "https://localhost:4200",
                "http://127.0.0.1:4200",
                "https://127.0.0.1:4200")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<IBoltGraphClient>(options =>
{
    var client = new BoltGraphClient(
        new Uri(builder.Configuration.GetConnectionString("Neo4j")!),
        builder.Configuration.GetSection("Neo4j:User").Value,
        builder.Configuration.GetSection("Neo4j:Password").Value
    );

    client.JsonConverters.Add(new PolymorphicJsonLabelConverter<Place>((place, labels) => { }));

    client.ConnectAsync().Wait();
    return client;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    Console.BackgroundColor = ConsoleColor.Black;
    Console.ForegroundColor = ConsoleColor.White;
    Console.WriteLine("API Route: " + context.Request.Path + " " + DateTime.Now);
    await next.Invoke();
});

app.UseCors("CORSDevelopment");

app.UseAuthorization();

app.MapControllers();

app.Run();
