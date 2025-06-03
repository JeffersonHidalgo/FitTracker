using Data;
using Data.Repos;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//var mySqlConfig = new MysqlConfig(builder.Configuration.GetConnectionString("MySqlConection"));
//builder.Services.AddSingleton(mySqlConfig);

builder.Services.AddSingleton(new MysqlConfig(builder.Configuration.GetConnectionString("MySqlConection")));

builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "imagen-cliente")),
    RequestPath = "/imagen-cliente"
});

app.UseCors();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
