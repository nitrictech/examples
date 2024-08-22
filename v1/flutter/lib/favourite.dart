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
