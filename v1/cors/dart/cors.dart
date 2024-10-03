import 'package:nitric_sdk/nitric.dart';

class CorsApi extends Api {
  late List<String> registeredOptions;

  CorsApi(super.name, [ApiOptions? opts]) {
    registeredOptions = [];
    Nitric.api(name, opts: opts);
  }

  Future<HttpContext> optionsHandler(HttpContext ctx) async {
    ctx.res.headers["Content-Type"] = ["text/html; charset=ascii"];
    ctx.res.body = "OK";

    return ctx;
  }

  HttpHandler addCors(HttpHandler handler) {
    return (HttpContext ctx) async {
      ctx.res.headers["Access-Control-Allow-Origin"] = ["*"];
      ctx.res.headers["Access-Control-Allow-Headers"] = [
        "Origin, Content-Type, Accept, Authorization",
      ];
      ctx.res.headers["Access-Control-Allow-Methods"] = [
        "GET, PUT, POST, OPTIONS, DELETE",
      ];
      ctx.res.headers["Access-Control-Max-Age"] = ["7200"];

      return handler(ctx);
    };
  }

  void createOptionsHandler(String match) {
    if (!registeredOptions.contains(match)) {
      registeredOptions.add(match);
      options(match, optionsHandler);
    }
  }

  @override
  Future<void> get(String match, HttpHandler handler,
      {List<OidcOptions>? security}) {
    createOptionsHandler(match);

    return super.get(match, addCors(handler), security: security);
  }

  @override
  Future<void> post(String match, HttpHandler handler,
      {List<OidcOptions>? security}) {
    createOptionsHandler(match);

    return super.post(match, addCors(handler), security: security);
  }

  @override
  Future<void> put(String match, HttpHandler handler,
      {List<OidcOptions>? security}) {
    createOptionsHandler(match);

    return super.put(match, addCors(handler), security: security);
  }

  @override
  Future<void> patch(String match, HttpHandler handler,
      {List<OidcOptions>? security}) {
    createOptionsHandler(match);

    return super.patch(match, addCors(handler), security: security);
  }

  @override
  Future<void> delete(String match, HttpHandler handler,
      {List<OidcOptions>? security}) {
    createOptionsHandler(match);

    return super.delete(match, addCors(handler), security: security);
  }
}
