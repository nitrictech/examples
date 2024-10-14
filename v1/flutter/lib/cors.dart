import 'package:nitric_sdk/nitric.dart';

/// Handle Preflight Options requests by returning status 200 to the requests
Future<HttpContext> optionsHandler(HttpContext ctx) async {
  ctx.res.headers["Content-Type"] = ["text/html; charset=ascii"];
  ctx.res.body = "OK";

  return ctx.next();
}

/// Add CORS headers to responses
Future<HttpContext> addCors(HttpContext ctx) async {
  ctx.res.headers["Access-Control-Allow-Origin"] = ["*"];
  ctx.res.headers["Access-Control-Allow-Headers"] = [
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  ];
  ctx.res.headers["Access-Control-Allow-Methods"] = [
    "GET, PUT, POST, PATCH, OPTIONS, DELETE",
  ];
  ctx.res.headers["Access-Control-Max-Age"] = ["7200"];

  return ctx.next();
}
