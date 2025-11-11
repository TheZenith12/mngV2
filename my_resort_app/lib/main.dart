import 'package:flutter/material.dart';

// Pages
import 'pages/resorts_page.dart'; // App.jsx-ийн хөрвүүлсэн хувилбар
import 'pages/details_page.dart'; // Details.jsx-ийн хөрвүүлсэн хувилбар

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Амралтын газрууд',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const ResortsPage(),
        '/details': (context) {
          final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
          final resortId = args['id'] as String;
          return DetailsPage(resortId: resortId);
        },
      },
    );
  }
}
