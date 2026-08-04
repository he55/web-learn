using Scalar.AspNetCore;

const string SOUNDS_FOLDER = "sounds";

if (!Directory.Exists(SOUNDS_FOLDER))
    Directory.CreateDirectory(SOUNDS_FOLDER);

_ = SoundService.SpeakAsync();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});


var app = builder.Build();

app.UseCors();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapPost("/tts/post", async (ContentDto dto) =>
{
    var item = new Call { content = dto.content };

    await SoundService.InputChannel.Writer.WriteAsync(item);

    for (int i = 0; i < 60; i++)
    {
        await Task.Delay(150);

        if (item.url != null)
            break;
    }

    return Results.Ok(item);
});

app.MapGet("/tts/sounds/{filename}", (string filename) =>
{
    string path = Path.GetFullPath($"{SOUNDS_FOLDER}/{filename}");
    return Results.File(path, "audio/mp3");
});

app.Run();

record ContentDto(string content);
