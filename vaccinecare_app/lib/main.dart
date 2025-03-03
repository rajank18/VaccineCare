import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:vaccinecare_app/screens/home_page.dart';
import 'package:vaccinecare_app/screens/login_page.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  );

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Vaccine Care',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: AuthRedirectScreen(), // ✅ Redirect to correct screen
    );
  }
}

// Redirects based on authentication state
class AuthRedirectScreen extends StatelessWidget {
  final _supabase = Supabase.instance.client;

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<AuthState>(
      stream: _supabase.auth.onAuthStateChange,
      builder: (context, snapshot) {
        final session = _supabase.auth.currentSession;
        
        if (session != null && session.user != null) {
          return HomeScreen(); // ✅ Redirect to Home if logged in
        } else {
          return AuthScreen(); // ✅ Show Login/Sign-Up
        }
      },
    );
  }
}
