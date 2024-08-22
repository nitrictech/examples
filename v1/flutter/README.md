# Building a Flutter Application with Nitric

In this guide we'll go over how to create a basic Flutter application using the Nitric framework as the backend. Dart does not have native support on AWS, GCP, or Azure, so by using the Nitric framework you can use your skills in Dart to create an API and interact with cloud services in an intuitive way.

The application will have a Flutter frontend that will generate wordpairs that can be added to a list of favourites. The backend will be a Nitric API with a key value store that can store favourited wordpairs. This application will be simple, but requires that you know the basics of Flutter and Nitric.

## Getting started

To get started make sure you have the following prerequisites installed:

- [Dart](https://dart.dev/get-dart)
- [Flutter](https://docs.flutter.dev/get-started/install)
- The [Nitric CLI](/getting-started/installation)
- An [AWS](https://aws.amazon.com), [Google Cloud](https://cloud.google.com) or [Azure](https://azure.microsoft.com) account (_your choice_)

Start by making sure your environment is set up correctly with Flutter for web development.

```txt
flutter doctor
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 3.24.0, on macOS darwin-arm64, locale en)
[✓] Android toolchain - develop for Android devices (Android SDK version 35.0.1)
[✓] Xcode - develop for iOS and macOS (Xcode 15)
[✓] Chrome - develop for the web
[✓] Android Studio (version 2024.1)
[✓] VS Code (version 1.92)
[✓] Connected device (4 available)
[✓] HTTP Host Availability

• No issues found!
```

We can then scaffold the project using the following command:

```bash
flutter create word_generator
```

Then open your project in your favourite editor:

```bash
code word_generator
```

## Backend

Let's start by building out the backend. This will be an API with a route dedicated to getting a list of all the favourites and a route to toggle a favourite on or off. These favourites will be stored in a [key value store](/keyvalue). To create a Nitric project add the `nitric.yaml` to the Flutter template project.

```yaml {{ label: "nitric.yaml" }}
name: word_generator
services:
  - match: lib/services/*.dart
    start: dart run $SERVICE_PATH
```

This points the project to the services that we will create in the `lib/services` directory. We'll create that directory and a file to start building our services.

```bash
mkdir lib/services
touch lib/services/main.dart
```

You will also need to add Nitric to your `pubspec.yaml`.

```yaml {{ label: "pubspec.yaml" }}
dependencies:
  flutter:
    sdk: flutter

  nitric_sdk:
    git:
      url: https://github.com/nitrictech/dart-sdk.git
      ref: main
```

### Building the API

Define the API and the key value store in the `main.dart` service file. This will create an API named `main` and a kv store named `favourites` and give the function permissions to get, set, and delete documents. The `favourites` store will contain keys with the name of the favourite and then a value with the favourites object.

```dart {{ label: "lib/services/main.dart" }}
import 'package:nitric_sdk/nitric.dart';

void main() {
  final api = Nitric.api("main");

  final favouritesKV = Nitric.kv("favourites").allow([
    KeyValueStorePermission.get,
    KeyValueStorePermission.set,
    KeyValueStorePermission.delete
  ]);
}
```

We will define a favourites class to convert our JSON requests to Favourite objects and then back into JSON. Conversion to a `Map<String, dynamic` will also allow us to store the Favourites objects in the key value store. We can do this by defining `fromJson` and `toJson` methods, allowing the builtin `jsonEncode` and `jsonDecode` methods to understand our model. By defining this as a class it unifies the way the frontend and backend handle Favourites objects, while leaving room for extension for additional metadata.

```dart {{ label: "lib/favourite.dart" }}
class Favourite {
  /// The name of the favourite
  String name;

  Favourite(this.name);

  /// Convert a json decodable map to a Favourite object
  Favourite.fromJson(Map<String, dynamic> json) : name = json['name'];

  /// Convert a Favourite object to a json encodable
  static Map<String, dynamic> toJson(Favourite favourite) =>
    {'name': favourite.name};
}
```

For the API we will define two routes, one GET method for `/favourites` and one POST method on `/favourite`. Let's start by defining the GET `/favourites` route. Make sure you import `dart:convert` to get access to the `jsonEncode` method for converting the documents to favourites.

```dart {{ label: "lib/services/main.dart" }}
import 'dart:convert';

...

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
```

We can then define the route for adding favourites. This will toggle a favourite on or off depending on whether the key exists in the key value store. Make sure you import the `Favourite` class from `package:word_generator/favourite.dart`

```dart {{ label: "lib/services/main.dart" }}
import 'package:word_generator/favourite.dart';

...

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
```

### Cross-Origin Resource Sharing

When we are making requests to our backend from our frontend, we will run into issues with Cross-Origin Resource Sharing (CORS) errors. We can handle this by adding CORS headers to our responses and adding OPTIONS methods to respond to preflight requests from the frontend. If you want to learn more about CORS, you can read [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). Create a file called `lib/cors.dart` which is where we will define the middleware and options handler.

```dart {{ label: "lib/cors.dart" }}cors.
import 'package:nitric_sdk/nitric.dart';

/// Handle Preflight Options requests by returning status 200 to the requests
Future<HttpContext> optionsHandler(HttpContext ctx) async {
  ctx.res.headers["Content-Type"] = ["text/html; charset=ascii"];
  ctx.res.body = "OK";

  return ctx.next();
}

/// Add CORS headers to responses
Future<HttpContext> addCors(HttpContext ctx) async {
  ctx.res.headers["Access-Control-Allow-Origin"] = ["*"];
  ctx.res.headers["Access-Control-Allow-Headers"] = [
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  ];
  ctx.res.headers["Access-Control-Allow-Methods"] = [
    "GET, PUT, POST, PATCH, OPTIONS, DELETE",
  ];
  ctx.res.headers["Access-Control-Max-Age"] = ["7200"];

  return ctx.next();
}
```

We can then add the options routes and add the CORS middleware to the API. When we add a middleware at the API level it will run on every request to any route on that API.

```dart {{ label: "lib/services/main.dart" }}
import 'package:flutter_blog/cors.dart';

...

final api = Nitric.api("main", opts: ApiOptions(middlewares: [addCors]));

...

api.options("/favourites", optionsHandler);
api.options("/favourite", optionsHandler);
```

### Test

You can start your backend for testing using the following command.

```bash
nitric start
```

You can test the routes using the dashboard or cURL commands in your terminal.

```bash
> curl http://localhost:4001/favourites
[]

> curl -X POST -d '{"name": "testpair"}' http://localhost:4001/favourite
> curl http://localhost:4001/favourites
[{"name": "testpair"}]
```

## Frontend

We can now start on the frontend. The application will contain two pages which can be navigated between by using the

The first will show the current generated word along with a history of all previously generated words. It will have a button to like the word and a button to generate the next word.

![main flutter page](/docs/images/guides/flutter/main_page_final.png)

The second page will show the list of favourites if there are any, otherwise it will display that there are no word pairs currently favourited.

![favourites flutter page](/docs/images/guides/flutter/favourites_page_final.png)

### Providers

Before creating these pages, we'll first create the data providers as these are required for the pages to function. These will be split into a provider for word generation and a provider for favourites gathering. These will both be `ChangeNotifiers` to allow for dynamic updates to the pages.

Let's start with the word provider. For this you'll need to add the `english_words` dependency to generate new words.

```bash
flutter pub add english_words
```

We can then build the `WordProvider`.

```dart {{ label: "lib/providers/word.dart" }}
import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';

class WordProvider extends ChangeNotifier {
  // The current word pair
  var current = WordPair.random();
}
```

We'll then define a function for getting a new word pair and notifying the listeners.

```dart {{ label: "lib/providers/word.dart" }}
// Generate a new word pair and notify the listeners
void getNext() {
  current = WordPair.random();
  notifyListeners();
}
```

We can then build the `FavouritesProvider`. This will use the Nitric API to get a list of favourites and also toggle if a favourite is liked or not. To start, we'll define our `FavouritesProvider` and add the attributes for setting the list of favourites and whether the list is loading.

```dart {{ label: "lib/providers/favourites.dart" }}
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:word_generator/favourite.dart';
import 'package:http/http.dart' as http;

class FavouritesProvider extends ChangeNotifier {
  final baseApiUrl = "http://localhost:4001";

  List<Favourite> _favourites = [];
  bool _isLoading = false;

  /// Get a list of active favourites
  List<Favourite> get favourites => _favourites;

  /// Check whether the data is loading or not
  bool get isLoading => _isLoading;
}
```

We'll then add a method for getting a list of favourites and notifying the listeneres. For this we require the `http` package to make requests to our API.

```bash
flutter pub add http
```

```dart {{ label: "lib/providers/favourites.dart" }}
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
    _favourites =
        List<Favourite>.from(rawFavourites.map((model) => Favourite.fromJson(model)));
  } else {
    throw Exception('Failed to load data');
  }

  _isLoading = false;
  notifyListeners();

  return _favourites;
}
```

We can then make a function for listeners to check if a word pair has been favourited. This requires the `english_words` package for importing the `WordPair` typing.

```dart {{ label: "lib/providers/favourites.dart" }}
/// Add english words import
import 'package:english_words/english_words.dart';

...

/// Checks if the word pair exists in the list of favourites
bool hasFavourite(WordPair pair) {
  if (isLoading) {
    return false;
  }

  return _favourites.any((f) => f.name == pair.asLowerCase);
}
```

Finally, we'll define a function for toggling a word pair as being liked or unliked.

```dart {{ label: "lib/providers/favourites.dart" }}
/// Toggles whether a favourite being liked or unliked.
Future<void> toggleFavourite(WordPair pair) async {
// Convert the word pair into a json encoded
final encodedFavourites = jsonEncode(Favourite.toJson(Favourite(pair.asLowerCase)));

    // Makes a post request to the toggle favourite route.
    final response = await http.post(Uri.parse("$baseApiUrl/favourite"), body: encodedFavourites);

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
```

### Generator Page

We can now build our generator page, the central functionality of our application. Add the provider package to be able to respond to change notifier events.

```bash
flutter pub add provider
```

You can then create the generator page with the following stateless widget. This will display a card with the generated word, along with a button for liking the word pair or generating the next pair.

```dart {{ label: "lib/pages/generator.dart" }}
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:word_generator/providers/favourites.dart';
import 'package:word_generator/providers/word.dart';

class GeneratorPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Get a reference to the current color scheme
    final theme = Theme.of(context);

    final style = theme.textTheme.displayMedium!.copyWith(
      color: theme.colorScheme.onPrimary,
    );

    // Start listening to both the favourites and the word providers
    final favourites = context.watch<FavouritesProvider>();
    final words = context.watch<WordProvider>();

    IconData icon = Icons.favorite_border;

    if (favourites.hasFavourite(words.current)) {
      icon = Icons.favorite;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Card to display the word pair generated
          Card(
            color: theme.colorScheme.primary,
            child: Padding(
              padding: const EdgeInsets.all(20),
              // Smooth animate the box changing size
              child: AnimatedSize(
                duration: Duration(milliseconds: 200),
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
          SizedBox(height: 10),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Button to like the current word pair
              ElevatedButton.icon(
                onPressed: () {
                  favourites.toggleFavourite(words.current);
                },
                icon: Icon(icon),
                label: Text('Like'),
              ),
              SizedBox(width: 10),
              // Button to generate the next word pair
              ElevatedButton(
                onPressed: () {
                  words.getNext();
                },
                child: Text('Next'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
```

To test this generation we can build the application entrypoint to run our paplication. In this application we use a `MultiProvider` to supply the child pages with the ability to listen to the `FavouritesProvider` and the `WordProvider`.

```dart {{ label: "lib/main.dart" }}
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:word_generator/pages/generator.dart';
import 'package:word_generator/providers/favourites.dart';
import 'package:word_generator/providers/word.dart';

// Start the application
void main() => runApp(Application());

class Application extends StatelessWidget {
  const Application({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      // Allow the child pages to reference the data providers
      providers: [
        ChangeNotifierProvider(create: (context) => FavouritesProvider()),
        ChangeNotifierProvider(create: (context) => WordProvider()),
      ],
      child: MaterialApp(
        title: 'Word Generator App',
        theme: ThemeData(
          useMaterial3: true,
          // Set the default colour for the application.
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        ),
        // Set the home page to the generator page
        home: GeneratorPage(),
      ),
    );
  }
}
```

You can test the generator page by starting the API and running the flutter app. Use the following commands (in separate terminals):

```bash
nitric start

flutter run -d chrome
```

This page should currently look like so:

![initial generator page](/docs/images/guides/flutter/main_page_1.png)

#### Optional: History Animation

We can add a list of previously generated word pairs to make our generator page more interesting. This will be a trailing list which will slowly get more transparent as it goes off the page. We'll start by updating our `WordProvider` with history.

```dart {{ label: "lib/providers/word.dart" }}
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
```

These new features in the word pair will be used by a new widget called `HistoryListView` that will be used by the `GeneratorPage`. You can add this to the bottom of the generator page.

```dart {{ label: "lib/pages/generator.dart" }}
class HistoryListView extends StatefulWidget {
  const HistoryListView({super.key});

  @override
  State<HistoryListView> createState() => _HistoryListViewState();
}

class _HistoryListViewState extends State<HistoryListView> {
  final _key = GlobalKey();

  // Create a linear gradient mask from transparent to opaque.
  static const Gradient _maskingGradient = LinearGradient(
    colors: [Colors.transparent, Colors.black],
    stops: [0.0, 0.5],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  @override
  Widget build(BuildContext context) {
    final favourites = context.watch<FavouritesProvider>();
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
        padding: EdgeInsets.only(top: 100),
        initialItemCount: words.history.length,
        // Build each item in the list, will be run initially and when a new word pair is added.
        itemBuilder: (context, index, animation) {
          final pair = words.history[index];
          return SizeTransition(
            sizeFactor: animation,
            child: Center(
              child: TextButton.icon(
                onPressed: () {
                  favourites.toggleFavourite(pair);
                },
                // If the word pair was favourited, show a heart next to it
                icon: favourites.hasFavourite(pair)
                    ? Icon(Icons.favorite, size: 12)
                    : SizedBox(),
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
```

With that built you can add it to the `GeneratorPage`.

```dart {{ label: "lib/pages/generator.dart" }}
return Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Expanded( // <- allows the list to extend to the top of the page
        flex: 3,
        child: HistoryListView(), // <- Add the history list view here
      ),
      SizedBox(height: 10),
      Card(
        ...
      ),
      ...
      Spacer(flex: 2), // <- Stops the Card being pushed to the bottom of the page
    ]
  )
);
```

If you reload the flutter app it should now display your history when you click through the words.

![generator page with history](/docs/images/guides/flutter/main_page_2.png)

### Favourites Page

The favourites page will simply list all the favourites and the number that have been favourited:

```dart {{ label: "lib/pages/favourites.dart" }}
import 'package:flutter/material.dart';
import 'package:word_generator/providers/favourites.dart';
import 'package:provider/provider.dart';

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
```

You might notice at no point is the favourites list actually being fetched, so the `FavouritesProvider` will always contain an empty favourites list. This will be handled in the next section where we build the navigation.

### Navigation

To finish, we'll add the navigation page. This will wrap the `GeneratorPage` and the `FavouritesPage` and allow a user to switch between them through a nav bar. This will be responsive, with a desktop having it appear on the side and a mobile appearing at the bottom. It will be a `StatefulWidget` so it can maintain the page that is being viewed. In the `initState` we will fetch the favourites data.

Start by scaffolding the main page `StatefulWidget` and `State`.

```dart {{ label: "lib/pages/home.dart" }}
import 'package:flutter/material.dart';
import 'package:word_generator/providers/favourites.dart';
import 'package:provider/provider.dart';

import 'favourites.dart';
import 'generator.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // The page that the user is currently viewing: Generator (0) or Favourites (1)
  var selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    // Fetch
    context.read<FavouritesProvider>().fetchData();
  }
}
```

We then want to fill out the `build` function so it returns the current page. This will be wrapped in a `ColoredBox` that has a consistent background colour between all pages.

```dart {{ label: "lib/pages/home.dart" }}
@override
Widget build(BuildContext context) {
  Widget page;
  switch (selectedIndex) {
    case 0:
      page = GeneratorPage();
    case 1:
      page = FavouritesPage();
    default:
      throw UnimplementedError('no widget for $selectedIndex');
  }

  var colorScheme = Theme.of(context).colorScheme;

  // The container for the current page, with its background color
  // and subtle switching animation.
  var mainArea = ColoredBox(
    color: colorScheme.surfaceContainerHighest,
    child: AnimatedSwitcher(
      duration: Duration(milliseconds: 200),
      child: page,
    ),
  );

  return mainArea;
}
```

You can now set the application's entrypoint page to be the `HomePage` now in `lib/main.dart`

```dart {{ label: "lib/main.dart" }}
import 'package:word_generator/pages/home.dart'; // <-- Add import

...

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
        home: HomePage(), // <-- Change here
      ),
    );
  }
}
```

For now, you can test both pages by swapping the `selectedIndex` manually. We'll then want to build out a navigation bar for desktop and for mobile. For this we will use a `LayoutBuilder` to check if the screen width is less than 450px.

```dart {{ label: "lib/pages/home.dart" }}
Widget build(BuildContext context) {
  ...

  return Scaffold(
    body: LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 450) {
          // return mobile navigation
        } else {
          // return desktop navigation
        }
      }
    )
  )
}
```

Starting with the mobile navigation:

```dart {{ label: "lib/pages/home.dart" }}
return Column(
  children: [
    Expanded(child: mainArea),
    SafeArea(
      child: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Favorites',
          ),
        ],
        currentIndex: selectedIndex,
        onTap: (value) {
          setState(() {
            selectedIndex = value;
          });
        },
      ),
    )
  ],
);
```

And then finally the desktop navigation:

```dart {{ label: "lib/pages/home.dart" }}
return Row(
  children: [
    SafeArea(
      child: NavigationRail(
        // Display only icons if screen width is less than 600px
        extended: constraints.maxWidth >= 600,
        destinations: [
          NavigationRailDestination(
            icon: Icon(Icons.home),
            label: Text('Home'),
          ),
          NavigationRailDestination(
            icon: Icon(Icons.favorite),
            label: Text('Favourites'),
          ),
        ],
        selectedIndex: selectedIndex,
        onDestinationSelected: (value) {
          setState(() {
            selectedIndex = value;
          });
        },
      ),
    ),
    Expanded(child: mainArea),
  ],
);
```

Altogether, the page code should look like this:

```dart {{ label: "lib/pages/home.dart" }}
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:word_generator/providers/favourites.dart';

import 'favourites.dart';
import 'generator.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  var selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    context.read<FavouritesProvider>().fetchData();
  }

  @override
  Widget build(BuildContext context) {
    var colorScheme = Theme.of(context).colorScheme;

    Widget page;
    switch (selectedIndex) {
      case 0:
        page = GeneratorPage();
      case 1:
        page = FavouritesPage();
      default:
        throw UnimplementedError('no widget for $selectedIndex');
    }

    // The container for the current page, with its background color
    // and subtle switching animation.
    var mainArea = ColoredBox(
      color: colorScheme.surfaceContainerHighest,
      child: AnimatedSwitcher(
        duration: Duration(milliseconds: 200),
        child: page,
      ),
    );

    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth < 450) {
            return Column(
              children: [
                Expanded(child: mainArea),
                SafeArea(
                  child: BottomNavigationBar(
                    items: [
                      BottomNavigationBarItem(
                        icon: Icon(Icons.home),
                        label: 'Home',
                      ),
                      BottomNavigationBarItem(
                        icon: Icon(Icons.favorite),
                        label: 'Favorites',
                      ),
                    ],
                    currentIndex: selectedIndex,
                    onTap: (value) {
                      setState(() {
                        selectedIndex = value;
                      });
                    },
                  ),
                )
              ],
            );
          } else {
            return Row(
              children: [
                SafeArea(
                  child: NavigationRail(
                    extended: constraints.maxWidth >= 600,
                    destinations: [
                      NavigationRailDestination(
                        icon: Icon(Icons.home),
                        label: Text('Home'),
                      ),
                      NavigationRailDestination(
                        icon: Icon(Icons.favorite),
                        label: Text('Favorites'),
                      ),
                    ],
                    selectedIndex: selectedIndex,
                    onDestinationSelected: (value) {
                      setState(() {
                        selectedIndex = value;
                      });
                    },
                  ),
                ),
                Expanded(child: mainArea),
              ],
            );
          }
        },
      ),
    );
  }
}
```

## Deployment

At this point, you can deploy the application to any supported cloud provider. Start by setting up your credentials and any configuration for the cloud you prefer:

- [AWS](/reference/providers/aws)
- [Azure](/reference/providers/azure)
- [Google Cloud](/reference/providers/gcp)

Next, we'll need to create a `stack`. Stacks represent deployed instances of an application, including the target provider and other details such as the deployment region. You'll usually define separate stacks for each environment such as development, testing and production. For now, let's start by creating a `dev` stack for AWS.

```bash
nitric stack new dev aws
```

You'll then need to edit the `nitric.dev.yaml` file to add a region.

```yaml {{ label: "nitric.dev.yaml" }}
provider: nitric/aws@1.11.1
region: us-east-1
```

### Dockerfile

Because we've mixed Flutter and Dart dependencies, we need to use a [custom container](/docs/reference/custom-containers) that fetches our dependencies using Flutter. You can point to a custom container in your `nitric.yaml`:

<Note>
  If you have a separate Dart backend that doesn't share dependencies with your
  Flutter application, this step is unnecessary.
</Note>

```yaml {{ label: "nitric.yaml" }}
name: word_generator
services:
  - match: lib/services/*.dart
    runtime: flutter # <-- Specifies the runtime to use
    start: dart run --observe $SERVICE_PATH
runtimes:
  flutter:
    dockerfile: ./docker/flutter.dockerfile # <-- Specifies where to find the Dockerfile
    args: {}
```

Create the Dockerfile at the same path as your runtime specifies. This Dockerfile is fairly straightforward, taking its

```dockerfile {{ label: "docker/flutter.dockerfile" }}
FROM dart:stable AS build

# The Nitric CLI will provide the HANDLER arg with the location of our service
ARG HANDLER
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

# download Flutter SDK from Flutter Github repo
RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter

ENV DEBIAN_FRONTEND=dialog

# Set flutter environment path
ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Run flutter doctor
RUN flutter doctor

# Resolve app dependencies.
COPY pubspec.* ./
RUN flutter pub get

# Ensure the ./bin folder exists
RUN mkdir -p ./bin

# Copy app source code and AOT compile it.
COPY . .
# Ensure packages are still up-to-date if anything has changed
RUN flutter pub get --offline
# Compile the dart service into an exe
RUN dart compile exe ./${HANDLER} -o bin/main

# Start from scratch and copy in the necessary runtime files
FROM alpine

COPY --from=build /runtime/ /
COPY --from=build /app/bin/main /app/bin/

ENTRYPOINT ["/app/bin/main"]
```

We can also add a `.dockerignore` to optimise our image further:

```txt {{ label: "docker/flutter.dockerignore" }}
build
test

.nitric
.idea
.dart_tool
.git
docker

android
ios
linux
macos
web
windows
```

### AWS

<Note>
  Cloud deployments incur costs and while most of these resource are available
  with free tier pricing you should consider the costs of the deployment.
</Note>

Now that the application has been configured for deployment, let's try deploying it with the `up` command.

```bash
nitric up

API Endpoints:
──────────────
main: https://xxxxxxxx.execute-api.us-east-1.amazonaws.com
```

Once we have our API, we can update our flutter app to use the new endpoint. Go into the `FavouritesProvider` and set the `baseApiUrl` to your AWS endpoint.

```dart {{ label: "lib/providers/favourites.dart" }}
class FavouritesProvider extends ChangeNotifier {
  final baseApiUrl = "https://xxxxxxxx.execute-api.us-east-1.amazonaws.com";
```

When you're done testing your application you can tear it down from the cloud, use the `down` command:

```bash
nitric down
```
