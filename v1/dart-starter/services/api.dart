import 'package:nitric_sdk/nitric.dart';

void main() {
  final mainApi = Nitric.api("main");

  mainApi.get("/hello/:name", (ctx) async {
    final name = ctx.req.pathParams["name"]!;

    ctx.res.body = "Hello $name";

    return ctx;
  });
}
