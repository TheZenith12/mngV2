import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

const String API_BASE = String.fromEnvironment('VITE_API_URL', defaultValue: 'http://localhost:5000');

class ResortDetail {
  final String id;
  final String name;
  final String description;
  final String? price;
  final Map<String, dynamic>? location;
  final List<String> images;
  final List<String> videos;

  ResortDetail({
    required this.id,
    required this.name,
    required this.description,
    this.price,
    required this.location,
    required this.images,
    required this.videos,
  });

  factory ResortDetail.fromJson(Map<String, dynamic> json) {
    List<String> normalizeImages(dynamic field) {
      if (field == null) return [];
      if (field is List) return field.map((e) => e.toString()).toList();
      if (field is String) return [field];
      if (field is Map) return field.values.map((e) => e.toString()).toList();
      return [];
    }

    List<String> images = normalizeImages(
      json['images'] ?? json['gallery'] ?? json['image'] ?? json['photos'] ?? [],
    );

    List<String> videos = normalizeImages(
      (json['files']?[0]?['videos']) ?? [],
    );

    return ResortDetail(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: json['price']?.toString(),
      location: json['location'] ?? {},
      images: images.map((src) => src.startsWith('http') ? src : '$API_BASE/$src').toList(),
      videos: videos.map((src) => src.startsWith('http') ? src : '$API_BASE/$src').toList(),
    );
  }
}

class Review {
  final String id;
  final String userName;
  final String comment;
  final int rating;
  final DateTime createdAt;

  Review({
    required this.id,
    required this.userName,
    required this.comment,
    required this.rating,
    required this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['_id'] ?? '',
      userName: json['userName'] ?? 'Unknown',
      comment: json['comment'] ?? '',
      rating: json['rating'] ?? 0,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toString()),
    );
  }
}

class DetailsPage extends StatefulWidget {
  final String resortId;
  const DetailsPage({super.key, required this.resortId});

  @override
  State<DetailsPage> createState() => _DetailsPageState();
}

class _DetailsPageState extends State<DetailsPage> {
  bool loading = true;
  String error = '';
  ResortDetail? resort;
  String currentImg = '';
  List<Review> reviews = [];

  // Review state
  final _nameController = TextEditingController();
  final _commentController = TextEditingController();
  int rating = 5;

  final distanceUBtoKhujirt = 380;

  @override
  void initState() {
    super.initState();
    fetchResortDetail();
    fetchReviews();
  }

  Future<void> fetchResortDetail() async {
    try {
      final res = await http.get(Uri.parse('$API_BASE/api/admin/resorts/${widget.resortId}'));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        final detail = ResortDetail.fromJson(data['resort'] ?? data);
        setState(() {
          resort = detail;
          currentImg = detail.images.isNotEmpty ? detail.images[0] : '';
        });
      } else {
        setState(() => error = 'Серверээс мэдээлэл авахад алдаа гарлаа');
      }
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> fetchReviews() async {
    try {
      final res = await http.get(Uri.parse('$API_BASE/api/reviews/${widget.resortId}'));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        setState(() {
          reviews = (data as List).map((r) => Review.fromJson(r)).toList();
        });
      }
    } catch (e) {
      print('Fetch reviews error: $e');
    }
  }

  Future<void> submitReview() async {
    final name = _nameController.text;
    final comment = _commentController.text;
    if (name.isEmpty || comment.isEmpty) return;

    try {
      final res = await http.post(
        Uri.parse('$API_BASE/api/reviews/${widget.resortId}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'userName': name, 'rating': rating, 'comment': comment}),
      );
      if (res.statusCode == 200) {
        _nameController.clear();
        _commentController.clear();
        setState(() => rating = 5);
        fetchReviews();
      }
    } catch (e) {
      print('Submit review error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(
        body: Center(child: Text('⏳ Ачаалж байна...')),
      );
    }

    if (error.isNotEmpty || resort == null) {
      return Scaffold(
        body: Center(child: Text('⚠️ Алдаа гарлаа: $error')),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text(resort!.name)),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            children: [
              // Hero image
              Stack(
                children: [
                  Image.network(
                    currentImg.isNotEmpty ? currentImg : '$API_BASE/default-resort.jpg',
                    width: double.infinity,
                    height: 240,
                    fit: BoxFit.cover,
                  ),
                  Positioned(
                    bottom: 16,
                    left: 16,
                    child: Text(resort!.name, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // Description & Price
              Text(resort!.description.isNotEmpty ? resort!.description : 'Тайлбар байхгүй', style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 8),
              Text(resort!.price != null ? '💰 Үнэ: ${NumberFormat('#,###').format(int.parse(resort!.price!))} ₮' : '—', style: const TextStyle(color: Colors.teal, fontWeight: FontWeight.bold)),

              const SizedBox(height: 12),

              // Gallery
              resort!.images.isNotEmpty
                  ? SizedBox(
                      height: 100,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: resort!.images.length,
                        itemBuilder: (context, index) {
                          final src = resort!.images[index];
                          return GestureDetector(
                            onTap: () => setState(() => currentImg = src),
                            child: Container(
                              margin: const EdgeInsets.only(right: 8),
                              decoration: BoxDecoration(
                                border: Border.all(color: currentImg == src ? Colors.teal : Colors.transparent, width: 2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Image.network(src, width: 100, height: 80, fit: BoxFit.cover),
                            ),
                          );
                        },
                      ),
                    )
                  : const Text('Зураг алга байна.', style: TextStyle(fontStyle: FontStyle.italic)),

              const SizedBox(height: 12),

              // Video
              resort!.videos.isNotEmpty
                  ? SizedBox(
                      height: 200,
                      child: Center(
                        child: Text('🎥 Видео тоглуулагч энд нэмнэ (Flutter video_player ашиглана)'),
                      ),
                    )
                  : const SizedBox(),

              const SizedBox(height: 12),

              // Google Map
              resort!.location != null && resort!.location!.isNotEmpty
                  ? SizedBox(
                      height: 200,
                      child: Center(
                        child: Text('🗺️ Google Map embed энд нэмнэ (Flutter google_maps_flutter ашиглана)'),
                      ),
                    )
                  : const SizedBox(),

              const SizedBox(height: 12),

              // Distance
              Text('🛣️ Улаанбаатараас ${resort!.name} хүртэлх зай: $distanceUBtoKhujirt км', style: const TextStyle(fontWeight: FontWeight.bold)),

              const SizedBox(height: 16),

              // Reviews Form
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Зочдын сэтгэгдэл', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Нэрээ бичнэ үү')),
                  const SizedBox(height: 4),
                  TextField(controller: _commentController, decoration: const InputDecoration(labelText: 'Сэтгэгдэл'), maxLines: 3),
                  const SizedBox(height: 4),
                  DropdownButton<int>(
                    value: rating,
                    items: [1, 2, 3, 4, 5].map((n) => DropdownMenuItem(value: n, child: Text('$n од'))).toList(),
                    onChanged: (v) => setState(() => rating = v!),
                  ),
                  ElevatedButton(onPressed: submitReview, child: const Text('Илгээх')),
                ],
              ),

              const SizedBox(height: 16),

              // Reviews List
              reviews.isNotEmpty
                  ? Column(
                      children: reviews.map((r) {
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 4),
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('${r.userName} - ${r.rating} од', style: const TextStyle(fontWeight: FontWeight.bold)),
                                Text(r.comment),
                                Text(DateFormat('yyyy-MM-dd HH:mm').format(r.createdAt), style: const TextStyle(color: Colors.grey, fontSize: 12)),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    )
                  : const Text('Одоогоор сэтгэгдэл байхгүй', style: TextStyle(fontStyle: FontStyle.italic)),
            ],
          ),
        ),
      ),
    );
  }
}
