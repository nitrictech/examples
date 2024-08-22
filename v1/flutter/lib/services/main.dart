import 'dart:convert';

import 'package:nitric_sdk/nitric.dart';
import 'package:word_generator/cors.dart';
import 'package:word_generator/favourite.dart';

void main() {
  final api = Nitric.api("main", opts: ApiOptions(middlewares: [addCors]));

  final favouritesKV = Nitric.kv("favourites").allow([
    KeyValueStorePermission.get,
    KeyValueStorePermission.set,
    KeyValueStorePermission.delete
  ]);

  api.options("/favourites", optionsHandler);
  api.options("/favourite", optionsHandler);

  api.get("/favourites", (ctx) async {
    // Get a list of all the keys in the store
    var keyStream = await favouritesKV.keys();

    // Convert the keys to a list of favourites
    var favourites = await keyStream.asyncMap((k) async {
      final favourite = await favouritesKV.get(k);

      return favourite;
    }).toList();

    // Return the body as a list of favourites
    ctx.res.body = jsonEncode(favourites);

    return ctx;
  });

  api.post("/favourite", (ctx) async {
    final req = ctx.req.json();

    // convert the request json to a Favourite object
    final favourite = Favourite.fromJson(req);

    // search for the key, filtering by the name of the favourite
    final stream = await favouritesKV.keys(prefix: favourite.name);

    // checks if the favourite exists in the list of keys
    final exists = await stream.any((f) => f == favourite.name);

    // if it exists delete and return
    if (exists) {
      await favouritesKV.delete(favourite.name);

      return ctx;
    }

    // if it doesn't exist, create it
    try {
      await favouritesKV.set(favourite.name, Favourite.toJson(favourite));
    } catch (e) {
      ctx.res.status = 500;
      ctx.res.body = "could not set ${favourite.name}";
    }

    return ctx;
  });
}
