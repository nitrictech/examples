import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:word_generator/providers/favorites.dart';

class FavoritesPage extends StatelessWidget {
  const FavoritesPage({super.key});

  @override
  Widget build(BuildContext context) {
    var favorites = context.watch<FavoritesProvider>();

    // If the favorites list is still loading then show a spinning circle.
    if (favorites.isLoading) {
      return const Center(
          child: SizedBox(
        width: 40,
        height: 40,
        child: CircularProgressIndicator(color: Colors.blue),
      ));
    }

    // Otherwise return a list of all the favorites
    return ListView(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          // Display how many favorites there are
          child: Text('You have '
              '${favorites.favorites.length} favorites:'),
        ),
        // Create a list tile for every favorite in the list of favorites
        for (var favorite in favorites.favorites)
          ListTile(
            leading: Icon(Icons.favorite), // <- A heart icon
            title: Text(favorite.name),
          ),
      ],
    );
  }
}
