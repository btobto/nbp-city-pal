using Neo4jClient;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IBoltGraphClient>(options =>
{
    var client = new BoltGraphClient(
        new Uri(builder.Configuration.GetConnectionString("Neo4j")!),
        builder.Configuration.GetSection("Neo4j:User").Value,
        builder.Configuration.GetSection("Neo4j:Password").Value
    );

    client.ConnectAsync().Wait();
    return client;
});

var app = builder.Build();

//  Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
