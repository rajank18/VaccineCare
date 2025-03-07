import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:vaccinecare_app/screens/home_page.dart';
import 'package:vaccinecare_app/screens/auth_page.dart';
import 'package:shared_preferences/shared_preferences.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://xrpcxzjyyhxqmfrwwfdo.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycGN4emp5eWh4cW1mcnd3ZmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTMwMzcsImV4cCI6MjA1NjU2OTAzN30.ZGIJJCaC4_hmuzESOv6IIeTMywjHGmg_oE3UB5IF5xU',
  );

  final prefs = await SharedPreferences.getInstance();
  final storedEmail = prefs.getString('user_email');


  final supabase = Supabase.instance.client;

  runApp(MyApp(isLoggedIn: storedEmail != null));
}




class MyApp extends StatelessWidget {
  final bool isLoggedIn;
  MyApp({required this.isLoggedIn});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Vaccine Care',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: AuthRedirectScreen(), 
    );
  }
}

class AuthRedirectScreen extends StatelessWidget {
  final _supabase = Supabase.instance.client;

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<AuthState>(
      stream: _supabase.auth.onAuthStateChange,
      builder: (context, snapshot) {
        final session = _supabase.auth.currentSession;
        print("🔹 App Started - Current Session: ${session?.toJson()}"); // Debugging

        if (session != null && session.user != null) {
          return AuthScreen(); 
        } else {
          return AuthScreen(); 
        }
      },
    );
  }
} 