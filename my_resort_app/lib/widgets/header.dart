import 'dart:ui';
import 'package:flutter/material.dart';

class Header extends StatelessWidget {
  const Header({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Logo + title (glass)
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 6, sigmaY: 6),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.park, color: Colors.teal, size: 26),
                    SizedBox(width: 8),
                    Text('AmraltinGazar',
                        style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF08303A))),
                  ],
                ),
              ),
            ),
          ),

          // Actions
          Row(
            children: [
              TextButton.icon(
                onPressed: () => Navigator.pushNamed(context, '/'),
                icon: const Icon(Icons.home_rounded, color: Color(0xFF08303A)),
                label: const Text('Нүүр', style: TextStyle(color: Color(0xFF08303A))),
              ),
              const SizedBox(width: 6),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal.shade700,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () => Navigator.pushNamed(context, '/about_page.dart'),
                child: const Text('Бидний тухай'),
              )
            ],
          )
        ],
      ),
    );
  }
}
