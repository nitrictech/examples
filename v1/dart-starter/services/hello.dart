import 'package:nitric_sdk/nitric.dart';

void main() {
  final helloApi = Nitric.api("main");

  helloApi.get("/hello/:name", (ctx) async {
    final name = ctx.req.pathParams["name"]!;

    ctx.res.body = "Hello $name";

    return ctx;
  });
}
