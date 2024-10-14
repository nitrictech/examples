import 'dart:convert';
import 'package:word_generator/cors.dart';
import 'package:word_generator/favorite.dart';

import 'package:nitric_sdk/nitric.dart';

void main() async {
  final api = Nitric.api("main", opts: ApiOptions(middlewares: [addCors]));

  final favoritesKV = Nitric.kv("favorites").allow([
    KeyValueStorePermission.get,
    KeyValueStorePermission.set,
    KeyValueStorePermission.delete
  ]);

  api.options("/favorites", optionsHandler);
  api.get("/favorites", (ctx) async {
    var keys = await favoritesKV.keys();

    var favorites = await keys.asyncMap((k) async {
      final favorite = await favoritesKV.get(k);

      return favorite;
    }).toList();

    ctx.res.body = jsonEncode(favorites);

    return ctx;
  });

  api.options("/favorite", optionsHandler);
  api.post("/favorite", (ctx) async {
    final req = ctx.req.json();

    final favorite = Favorite.fromJson(req);

    var exists = false;

    final keys = await favoritesKV.keys(prefix: favorite.name);

    await for (final key in keys) {
      if (key == favorite.name) {
        exists = true;
      }
    }

    // if it exists delete and return
    if (exists) {
      await favoritesKV.delete(favorite.name);

      return ctx;
    }

    await favoritesKV.set(favorite.name, Favorite.toJson(favorite));

    return ctx;
  });
}
