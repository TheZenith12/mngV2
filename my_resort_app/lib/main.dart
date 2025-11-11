import 'package:flutter/material.dart';
import 'pages/home_page.dart';
import 'pages/details_page.dart'; // ⚡ энд байгаа эсэхийг шалгаарай!

void main() {
  runApp(const ResortApp());
}

class ResortApp extends StatelessWidget {
  const ResortApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Амралтын газрууд',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: Colors.teal,
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF5F5F5),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomePage(),
        '/detail': (context) => DetailPage(), // ✅ энд алдаа гарч байсан
      },
    );
  }
}
