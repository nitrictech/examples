import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:english_words/english_words.dart';
import 'package:word_generator/favorite.dart';

class FavoritesProvider extends ChangeNotifier {
  final baseApiUrl = "http://localhost:4001";

  List<Favorite> _favorites = [];
  bool _isLoading = false;

  /// Get a list of active favorite
  List<Favorite> get favorites => _favorites;

  /// Check whether the data is loading or not
  bool get isLoading => _isLoading;

  /// Updates the list of favorites whilst returning a Future with the list of favorites.
  /// Sets isLoading to true when the favorites have been fetched
  Future<List<Favorite>> fetchData() async {
    _isLoading = true;
    notifyListeners();

    final response = await http.get(Uri.parse("$baseApiUrl/favorites"));

    if (response.statusCode == 200) {
      // Decode the json data into an iterable list of unknown objects
      Iterable rawFavorites = jsonDecode(response.body);

      // Map over the iterable, converting it to a list of Favorite objects
      _favorites = List<Favorite>.from(
          rawFavorites.map((model) => Favorite.fromJson(model)));
    } else {
      throw Exception('Failed to load data');
    }

    _isLoading = false;
    notifyListeners();

    return _favorites;
  }

  bool hasFavorite(WordPair pair) {
    if (isLoading) {
      return false;
    }

    return _favorites.any((f) => f.name == pair.asLowerCase);
  }

  /// Toggles whether a favorite being liked or unliked.
  Future<void> toggleFavorite(WordPair pair) async {
    // Convert the word pair into a json encoded
    final encodedFavorites =
        jsonEncode(Favorite.toJson(Favorite(pair.asLowerCase)));

    // Makes a post request to the toggle favorite route.
    final response = await http.post(Uri.parse("$baseApiUrl/favorite"),
        body: encodedFavorites);

    // If the response doesn't respond with OK, throw an error
    if (response.statusCode != 200) {
      throw Exception("Failed to add favorite: ${response.body}");
    }

    // If it was successfully removed update favorites
    if (hasFavorite(pair)) {
      // Remove the favorite for
      _favorites.removeWhere((f) => f.name == pair.asLowerCase);
    } else {
      _favorites.add(Favorite(pair.asLowerCase));
    }

    notifyListeners();
  }
}
