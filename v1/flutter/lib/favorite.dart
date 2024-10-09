class Favorite {
  /// The name of the favorite
  String name;

  Favorite(this.name);

  /// Convert a json decodable map to a Favorite object
  Favorite.fromJson(Map<String, dynamic> json) : name = json['name'];

  /// Convert a Favorite object to a json encodable
  static Map<String, dynamic> toJson(Favorite favorite) =>
      {'name': favorite.name};
}
