import 'package:flutter/material.dart';

class ResortCard extends StatelessWidget {
  final Map<String, String> resort;
  const ResortCard({super.key, required this.resort});

  @override
  Widget build(BuildContext context) {
    final image = resort['image'] ?? '';
    final name = resort['name'] ?? '';
    final location = resort['location'] ?? '';
    final price = resort['price'] ?? '';

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 14),
      child: InkWell(
        onTap: () => Navigator.pushNamed(context, '/detail', arguments: resort),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.06),
                blurRadius: 14,
                offset: const Offset(0, 8),
              )
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // image
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                child: AspectRatio(
                  aspectRatio: 16 / 9,
                  child: FadeInImage.assetNetwork(
                    placeholder: 'assets/placeholder.png',
                    image: image,
                    fit: BoxFit.cover,
                    imageErrorBuilder: (c, e, st) =>
                        Container(color: Colors.grey[300]),
                  ),
                ),
              ),

              Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // text
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(name,
                              style: const TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.w700)),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              const Icon(Icons.location_on, size: 14, color: Colors.teal),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(location,
                                    style: TextStyle(
                                        color: Colors.grey[700], fontSize: 13)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // price
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(price.isNotEmpty ? '${int.tryParse(price)?.toString()}₮' : '—',
                            style: TextStyle(
                                color: Colors.green.shade700, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 8),
                        ElevatedButton(
                          onPressed: () => Navigator.pushNamed(context, '/detail', arguments: resort),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.teal.shade600,
                            minimumSize: const Size(48, 36),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10)),
                          ),
                          child: const Text('Дэлгэрэнгүй', style: TextStyle(fontSize: 13)),
                        )
                      ],
                    )
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
