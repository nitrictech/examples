import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:word_generator/pages/home.dart';
import 'package:word_generator/providers/favourites.dart';
import 'package:word_generator/providers/word.dart';

void main() => runApp(Application());

class Application extends StatelessWidget {
  const Application({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => FavouritesProvider()),
        ChangeNotifierProvider(create: (context) => WordProvider()),
      ],
      child: MaterialApp(
        title: 'Word Generator App',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        ),
        home: HomePage(),
      ),
    );
  }
}
