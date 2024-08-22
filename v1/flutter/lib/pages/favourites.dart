import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:word_generator/providers/favourites.dart';

class FavouritesPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var favourites = context.watch<FavouritesProvider>();

    // If the favourites list is still loading then show a spinning circle.
    if (favourites.isLoading) {
      return Center(
          child: SizedBox(
        width: 40,
        height: 40,
        child: CircularProgressIndicator(color: Colors.blue),
      ));
    }

    // Otherwise return a list of all the favourites
    return ListView(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          // Display how many favourites there are
          child: Text('You have '
              '${favourites.favourites.length} favourites:'),
        ),
        // Create a list tile for every favourite in the list of favourites
        for (var favourite in favourites.favourites)
          ListTile(
            leading: Icon(Icons.favorite), // <- A heart icon
            title: Text(favourite.name),
          ),
      ],
    );
  }
}
