import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:english_words/english_words.dart';
import 'package:word_generator/favourite.dart';

class FavouritesProvider extends ChangeNotifier {
  final baseApiUrl = "http://localhost:4001";

  List<Favourite> _favourites = [];
  bool _isLoading = false;

  /// Get a list of active favourites
  List<Favourite> get favourites => _favourites;

  /// Check whether the data is loading or not
  bool get isLoading => _isLoading;

  /// Updates the list of favourites whilst returning a Future with the list of favourites.
  /// Sets isLoading to true when the favourites have been fetched
  Future<List<Favourite>> fetchData() async {
    _isLoading = true;
    notifyListeners();

    final response = await http.get(Uri.parse("$baseApiUrl/favourites"));

    if (response.statusCode == 200) {
      // Decode the json data into an iterable list of unknown objects
      Iterable rawFavourites = jsonDecode(response.body);

      // Map over the iterable, converting it to a list of Favourite objects
      _favourites = List<Favourite>.from(
          rawFavourites.map((model) => Favourite.fromJson(model)));
    } else {
      throw Exception('Failed to load data');
    }

    _isLoading = false;
    notifyListeners();

    return _favourites;
  }

  bool hasFavourite(WordPair pair) {
    if (isLoading) {
      return false;
    }

    return _favourites.any((f) => f.name == pair.asLowerCase);
  }

  /// Toggles whether a favourite being liked or unliked.
  Future<void> toggleFavourite(WordPair pair) async {
    // Convert the word pair into a json encoded
    final encodedFavourites =
        jsonEncode(Favourite.toJson(Favourite(pair.asLowerCase)));

    // Makes a post request to the toggle favourite route.
    final response = await http.post(Uri.parse("$baseApiUrl/favourite"),
        body: encodedFavourites);

    // If the response doesn't respond with OK, throw an error
    if (response.statusCode != 200) {
      throw Exception("Failed to add favourite: ${response.body}");
    }

    // If it was successfully removed update favourites
    if (hasFavourite(pair)) {
      // Remove the favourite for
      _favourites.removeWhere((f) => f.name == pair.asLowerCase);
    } else {
      _favourites.add(Favourite(pair.asLowerCase));
    }

    notifyListeners();
  }
}
