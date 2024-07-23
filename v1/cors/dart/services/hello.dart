import '../cors.dart';

void main() {
  final helloApi = CorsApi("main");

  helloApi.get("/hello/:name", (ctx) async {
    final name = ctx.req.pathParams["name"]!;

    ctx.res.body = "Hello $name";

    return ctx;
  });
}
