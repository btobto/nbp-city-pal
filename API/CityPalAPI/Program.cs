using CityPalAPI.Models;
using CityPalAPI.TransferModels;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.ObjectPool;
using Neo4jClient;
using Neo4jClient.ReturnPoly;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Logging.AddConsole();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddFluentValidationAutoValidation();

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

app.UseAuthorization();

app.MapControllers();

app.Run();
