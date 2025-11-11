import 'package:flutter/material.dart';

class HeroSection extends StatelessWidget {
  final String title;
  final String subtitle;
  final String imageUrl;

  const HeroSection({
    super.key,
    this.title = 'Тавтай морил',
    this.subtitle = 'Байгалийн гоо үзэсгэлэн, тайван амралт',
    this.imageUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 260,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Water-like subtle background image
          Image.network(imageUrl, fit: BoxFit.cover),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.black.withOpacity(0.35), Colors.transparent],
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
              ),
            ),
          ),
          // Center content
          Positioned(
            left: 20,
            bottom: 32,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Colors.white, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text(subtitle,
                    style: Theme.of(context)
                        .textTheme
                        .bodyMedium
                        ?.copyWith(color: Colors.white70)),
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: () => Navigator.pushNamed(context, '/'),
                  icon: const Icon(Icons.explore_outlined),
                  label: const Text('Амралтын газруудыг үзэх'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.teal.shade600,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10)),
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
