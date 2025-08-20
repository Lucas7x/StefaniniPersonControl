using StefaniniPC.API.Extensions;
using StefaniniPC.Application.Interfaces;
using StefaniniPC.Infrastructure.Database;
using StefaniniPC.Infrastructure.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DataContext
builder.Services.ConfigureDatabaseContext(builder.Configuration);

// Registering Repositories
builder.Services.AddScoped<IPersonRepository, PersonRepository>();

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
