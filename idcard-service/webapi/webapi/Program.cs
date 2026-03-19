using System.Net;
using webapi;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/read-card", () =>
{
    try
    {
        var res = IDCardUtil.readCard();
        return Results.Ok(res);
    }
    catch (Exception ex)
    {
        return Results.Text(ex.Message, statusCode: (int)HttpStatusCode.InternalServerError);
    }
});

app.Run();
