import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';

class WordProvider extends ChangeNotifier {
  // The current word pair
  var current = WordPair.random();
  // A list of all generated word pairs
  var history = <WordPair>[];

  // A key that is used to get a reference to the history list state
  GlobalKey? historyListKey;

  // Generate a new word pair and notify the listeners
  void getNext() {
    // Add the current pair to the start of the history list
    history.insert(0, current);

    // Adds space to the start of the animated list and triggers an animation to start
    var animatedList = historyListKey?.currentState as AnimatedListState?;
    animatedList?.insertItem(0);

    current = WordPair.random();
    notifyListeners();
  }
}
