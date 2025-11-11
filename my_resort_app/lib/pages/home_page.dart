import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<Map<String, String>> resorts = [
    {
      'name': 'Terelj Resort',
      'location': 'Tuv aimag, Terelj',
      'image': 'f4849412-a612-492d-9e93-239fab5f3df4.jpg',
      'days': '2 өдөр',
      'services': 'Ресторан, Усны бассейн, Аялал'
    },
    {
      'name': 'Khuvsgul Lake Resort',
      'location': 'Khuvsgul aimag',
      'image': '"Screenshot_30-10-2025_113917_localhost.jpeg"',
      'days': '3 өдөр',
      'services': 'Аялал, Завь, Амралтын байшин'
    },
    {
      'name': 'Gorkhi-Terelj Lodge',
      'location': 'Gorkhi-Terelj National Park',
      'image': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'days': '1 өдөр',
      'services': 'Ресторан, Аялал, Байгалийн үзэсгэлэн'
    },
    // more resorts...
  ];

  String searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final filteredResorts = resorts.where((resort) {
      return resort['name']!.toLowerCase().contains(searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('🏕 Амралтын газрууд'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Хайх...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                  borderSide: BorderSide.none,
                ),
              ),
              onChanged: (value) {
                setState(() {
                  searchQuery = value;
                });
              },
            ),
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: GridView.builder(
          itemCount: filteredResorts.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 0.8,
          ),
          itemBuilder: (context, index) {
            final resort = filteredResorts[index];
            return GestureDetector(
              onTap: () {
                Navigator.pushNamed(context, '/detail', arguments: resort);
              },
              child: Card(
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius:
                          const BorderRadius.vertical(top: Radius.circular(15)),
                      child: Image.network(
                        resort['image']!,
                        height: 100,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            resort['name']!,
                            style: const TextStyle(
                                fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            resort['location']!,
                            style: const TextStyle(fontSize: 12),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            resort['days']!,
                            style: const TextStyle(fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
