import 'package:flutter/material.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Бидний тухай"),
        backgroundColor: Colors.green,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: const [
            Text(
              "🌿 Амралтын газар төслийн зорилго:",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
            SizedBox(height: 10),
            Text(
              "Монголын үзэсгэлэнт байгальд байрлах амралтын газруудаар дамжуулан "
              "аялагч бүрт тав тух, амар амгаланг мэдрүүлэхийг зорьдог.",
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
