using Application = Nitric.Sdk.Nitric;

var api = Application.Api("main");

api.Get("/hello/:name", context =>
{
    var name = context.Req.PathParams["name"];

    context.Res.Text($"Hello {name}!");

    return context;
});

Application.Run();