import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:vaccinecare_app/screens/auth_page.dart';

class HomeScreen extends StatelessWidget {
  final _supabase = Supabase.instance.client;

  Future<void> logout(BuildContext context) async {
    await _supabase.auth.signOut();
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => AuthScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Home')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Welcome to Vaccine Care!'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => logout(context),
              child: Text('Logout'),
            ),
          ],
        ),
      ),
    );
  }
}
