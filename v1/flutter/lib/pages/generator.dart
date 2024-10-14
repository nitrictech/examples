import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:word_generator/providers/favorites.dart';
import 'package:word_generator/providers/word.dart';

class GeneratorPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final style = theme.textTheme.displayMedium!.copyWith(
      color: theme.colorScheme.onPrimary,
    );

    final favorites = context.watch<FavoritesProvider>();
    final words = context.watch<WordProvider>();

    IconData icon = Icons.favorite_border;

    if (favorites.hasFavorite(words.current)) {
      icon = Icons.favorite;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Expanded(
            // <- allows the list to extend to the top of the page
            flex: 3,
            child: HistoryListView(), // <- Add the history list view here
          ),
          const SizedBox(height: 10),
          Card(
            color: theme.colorScheme.primary,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: AnimatedSize(
                duration: const Duration(milliseconds: 200),
                child: MergeSemantics(
                  child: Wrap(
                    children: [
                      Text(
                        words.current.first,
                        style: style.copyWith(fontWeight: FontWeight.w200),
                      ),
                      Text(
                        words.current.second,
                        style: style.copyWith(fontWeight: FontWeight.bold),
                      )
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              ElevatedButton.icon(
                onPressed: () {
                  favorites.toggleFavorite(words.current);
                },
                icon: Icon(icon),
                label: const Text('Like'),
              ),
              const SizedBox(width: 10),
              ElevatedButton(
                onPressed: () {
                  words.getNext();
                },
                child: const Text('Next'),
              ),
            ],
          ),
          const Spacer(flex: 2),
        ],
      ),
    );
  }
}

class HistoryListView extends StatefulWidget {
  const HistoryListView({super.key});

  @override
  State<HistoryListView> createState() => _HistoryListViewState();
}

class _HistoryListViewState extends State<HistoryListView> {
  final _key = GlobalKey();

  // Create a mask which will make a fade out appearance by making a linear gradient of transparent -> opaque.
  static const Gradient _maskingGradient = LinearGradient(
    colors: [Colors.transparent, Colors.black],
    stops: [0.0, 0.5],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  @override
  Widget build(BuildContext context) {
    final favorites = context.watch<FavoritesProvider>();
    final words = context.watch<WordProvider>();

    // Set the key of the animated list to the WordProvider GlobalKey so it can be manipulated from there
    // Not recommended for a production app as it can slow performance...
    // Read more here: https://api.flutter.dev/flutter/widgets/GlobalKey-class.html
    words.historyListKey = _key;

    return ShaderMask(
      shaderCallback: (bounds) => _maskingGradient.createShader(bounds),
      // This blend mode takes the opacity of the shader (i.e. our gradient)
      // and applies it to the destination (i.e. our animated list).
      blendMode: BlendMode.dstIn,
      child: AnimatedList(
        key: _key,
        // Reverse the list so the latest is on the bottom
        reverse: true,
        padding: const EdgeInsets.only(top: 100),
        initialItemCount: words.history.length,
        // Build each item in the list, will be run initially and when a new word pair is added.
        itemBuilder: (context, index, animation) {
          final pair = words.history[index];
          return SizeTransition(
            sizeFactor: animation,
            child: Center(
              child: TextButton.icon(
                onPressed: () {
                  favorites.toggleFavorite(pair);
                },
                // If the word pair was favorited, show a heart next to it
                icon: favorites.hasFavorite(pair)
                    ? const Icon(Icons.favorite, size: 12)
                    : const SizedBox(),
                label: Text(
                  pair.asLowerCase,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
