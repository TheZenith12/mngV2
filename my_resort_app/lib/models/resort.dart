class Resort {
  final String name;
  final String location;
  final String image;
  final String description;
  final String date;
  final List<Service> services;

  Resort({
    required this.name,
    required this.location,
    required this.image,
    required this.description,
    required this.date,
    required this.services,
  });
}

class Service {
  final String title;
  final String image;
  final String detail;

  Service({required this.title, required this.image, required this.detail});
}
