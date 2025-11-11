import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

const String API_BASE = String.fromEnvironment('VITE_API_URL', defaultValue: 'http://localhost:5000');

class Resort {
  final String id;
  final String name;
  final String description;
  final String image;
  final int? price;

  Resort({
    required this.id,
    required this.name,
    required this.description,
    required this.image,
    this.price,
  });

  factory Resort.fromJson(Map<String, dynamic> json) {
    String imgSrc = '';
    final imageData = json['image'];

    if (imageData is List && imageData.isNotEmpty) {
      imgSrc = imageData[0];
    } else if (imageData is String) {
      imgSrc = imageData;
    } else if (imageData is Map) {
      imgSrc = imageData['url'] ?? imageData['path'] ?? imageData.values.first;
    }

    if (!imgSrc.startsWith('http')) {
      imgSrc = '$API_BASE${imgSrc.startsWith('/') ? imgSrc : '/$imgSrc'}';
    }

    return Resort(
      id: json['_id'] ?? '',
      name: json['name'] ?? 'Unnamed',
      description: json['description'] ?? '',
      image: imgSrc.isNotEmpty ? imgSrc : '/no-image.png',
      price: json['price'] != null ? int.tryParse(json['price'].toString()) : null,
    );
  }
}

class ResortsPage extends StatefulWidget {
  const ResortsPage({super.key});

  @override
  State<ResortsPage> createState() => _ResortsPageState();
}

class _ResortsPageState extends State<ResortsPage> {
  List<Resort> resorts = [];
  List<Resort> filteredResorts = [];
  bool loading = true;
  String error = '';
  String searchTerm = '';
  bool showSearch = false;

  @override
  void initState() {
    super.initState();
    fetchResorts();
  }

  Future<void> fetchResorts() async {
    setState(() {
      loading = true;
      error = '';
    });
    try {
      final response = await http.get(Uri.parse('$API_BASE/api/admin/resorts'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final listData = data['resorts'] ?? data;
        final resortList = (listData as List).map((r) => Resort.fromJson(r)).toList();
        setState(() {
          resorts = resortList;
          filteredResorts = resortList;
        });
      } else {
        setState(() {
          error = 'Серверээс мэдээлэл авахад алдаа гарлаа';
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  void filterResorts(String term) {
    final lowerTerm = term.trim().toLowerCase();
    if (lowerTerm.isEmpty) {
      setState(() {
        filteredResorts = resorts;
      });
      return;
    }

    final filtered = resorts.where((r) {
      return r.name.toLowerCase().contains(lowerTerm) ||
          (r.price != null && r.price.toString().contains(lowerTerm)) ||
          r.description.toLowerCase().contains(lowerTerm);
    }).toList();

    setState(() {
      filteredResorts = filtered;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Text('⏳ Мэдээлэл ачаалж байна...', style: TextStyle(fontSize: 18)),
        ),
      );
    }

    if (error.isNotEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Text('⚠️ Алдаа гарлаа: $error', style: const TextStyle(fontSize: 18, color: Colors.red)),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Амралтын газрууд'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => setState(() => showSearch = !showSearch),
          ),
        ],
        bottom: showSearch
            ? PreferredSize(
                preferredSize: const Size.fromHeight(60),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Хайх...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          setState(() {
                            searchTerm = '';
                            filteredResorts = resorts;
                          });
                        },
                      ),
                    ),
                    onChanged: (val) {
                      setState(() {
                        searchTerm = val;
                      });
                      filterResorts(val);
                    },
                  ),
                ),
              )
            : null,
      ),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: filteredResorts.isNotEmpty
            ? GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 0.7,
                ),
                itemCount: filteredResorts.length,
                itemBuilder: (context, index) {
                  final r = filteredResorts[index];
                  return Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 4,
                    clipBehavior: Clip.hardEdge,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Expanded(
                          child: Image.network(
                            r.image,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Image.asset('assets/no-image.png', fit: BoxFit.cover),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Column(
                            children: [
                              Text(r.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16), textAlign: TextAlign.center),
                              const SizedBox(height: 4),
                              Text(r.description.isNotEmpty ? r.description : 'Тайлбар байхгүй',
                                  maxLines: 2, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center),
                              const SizedBox(height: 4),
                              Text(r.price != null ? 'Үнэ: ${r.price!.toString()} ₮' : '—',
                                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green), textAlign: TextAlign.center),
                              const SizedBox(height: 6),
                              ElevatedButton(
                                onPressed: () {
                                  // TODO: Navigate to detail page
                                },
                                style: ElevatedButton.styleFrom(
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                ),
                                child: const Text('Дэлгэрэнгүй үзэх'),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              )
            : const Center(child: Text('😕 Тохирох амралт олдсонгүй.', style: TextStyle(fontSize: 18))),
      ),
    );
  }
}
