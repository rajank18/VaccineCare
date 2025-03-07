import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:vaccinecare_app/screens/baby_details.dart';
import '../screens/home_page.dart';

class AuthScreen extends StatefulWidget {
  @override
  _AuthScreenState createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final _supabase = Supabase.instance.client;

  bool isLogin = true;
  String email = '', password = '', name = '', phone = '', address = '';

  String hashPassword(String password) {
    var bytes = utf8.encode(password);
    var digest = sha256.convert(bytes);
    return digest.toString();
  }

  Future<void> checkBabyDetailsAndNavigate(String parentId) async {
  final response = await _supabase
      .from('babies')
      .select()
      .eq('parent_id', parentId)
      .maybeSingle();

  if (response != null) {
    // ✅ Baby details exist, go to HomePage
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => HomeScreen()),
    );
  } else {
    // ❌ Baby details do not exist, go to BabyDetailsPage
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => BabyDetailsPage(parentId: parentId)),
    );
  }
}


  Future<void> authenticateUser() async {
  if (!_formKey.currentState!.validate()) return;
  _formKey.currentState!.save();

  try {
    if (isLogin) {
      // LOGIN FLOW
      final response = await _supabase
          .from('users')
          .select()
          .eq('email', email)
          .eq('password_hash', hashPassword(password))
          .maybeSingle();

      if (response != null) {
        String parentId = response['user_id'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('user_email', email);
        print("✅ Email stored locally: $email");

        // Check if baby details exist and navigate accordingly
        await checkBabyDetailsAndNavigate(parentId);
      } else {
        print("❌ Invalid email or password");
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Invalid email or password')));
      }
    } else {
      // SIGN-UP FLOW
      final response = await _supabase.auth.signUp(email: email, password: password);
      if (response.user != null) {
        String parentId = response.user!.id;

        await _supabase.from('users').insert({
          'user_id': parentId, // Ensure parent_id is stored correctly
          'name': name,
          'email': email,
          'phone_number': phone,
          'address': address,
          'password_hash': hashPassword(password),
          'created_at': DateTime.now().toIso8601String(),
          'updated_at': DateTime.now().toIso8601String(),
        });

        // ✅ Directly go to BabyDetailsPage after Sign-Up (Skip checking baby details)
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => BabyDetailsPage(parentId: parentId)),
        );
      } else {
        print("❌ Sign-up failed: ${response.error?.message}");
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Sign-up failed: ${response.error?.message}')));
      }
    }
  } catch (error) {
    print("❌ Error: $error");
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.toString())));
  }
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: EdgeInsets.symmetric(horizontal: 24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.purple.shade200, Colors.blue.shade100, Colors.blue.shade400],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                RichText(
                  text: TextSpan(
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                    children: [
                      TextSpan(text: 'Vaccine', style: TextStyle(color: const Color.fromARGB(255, 0, 0, 0))),
                      TextSpan(text: 'Care', style: TextStyle(color: const Color.fromARGB(255, 225, 39, 203))),
                    ],
                  ),
                ),
                SizedBox(height: 20),
                Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 6,
                  child: Padding(
                    padding: EdgeInsets.all(20),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          isLogin ? 'Login' : 'Sign Up',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.blueAccent,
                          ),
                        ),
                        SizedBox(height: 20),
                        Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              if (!isLogin)
                                TextFormField(
                                  decoration: InputDecoration(labelText: 'Full Name'),
                                  validator: (val) =>
                                      val!.isEmpty ? 'Enter your name' : null,
                                  onSaved: (val) => name = val!,
                                ),
                              TextFormField(
                                decoration: InputDecoration(labelText: 'Email'),
                                keyboardType: TextInputType.emailAddress,
                                validator: (val) =>
                                    val!.isEmpty ? 'Enter a valid email' : null,
                                onSaved: (val) => email = val!,
                              ),
                              TextFormField(
                                decoration:
                                    InputDecoration(labelText: 'Phone Number'),
                                keyboardType: TextInputType.phone,
                                validator: (val) => val!.length < 10
                                    ? 'Enter a valid phone number'
                                    : null,
                                onSaved: (val) => phone = val!,
                              ),
                              TextFormField(
                                decoration: InputDecoration(labelText: 'Password'),
                                obscureText: true,
                                validator: (val) => val!.length < 6
                                    ? 'Password too short'
                                    : null,
                                onSaved: (val) => password = val!,
                              ),
                              if (!isLogin)
                                TextFormField(
                                  decoration: InputDecoration(labelText: 'Address'),
                                  validator: (val) =>
                                      val!.isEmpty ? 'Enter your address' : null,
                                  onSaved: (val) => address = val!,
                                ),
                              SizedBox(height: 20),
                              ElevatedButton(
                                onPressed: authenticateUser,
                                style: ElevatedButton.styleFrom(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 50, vertical: 15),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                child: Text(
                                  isLogin ? 'Login' : 'Sign Up',
                                  style: TextStyle(fontSize: 18),
                                ),
                              ),
                              SizedBox(height: 10),
                              TextButton(
                                onPressed: () =>
                                    setState(() => isLogin = !isLogin),
                                child: Text(
                                  isLogin
                                      ? 'Create an Account'
                                      : 'Already have an account? Login',
                                  style: TextStyle(color: Colors.blueAccent),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

extension on AuthResponse {
  get error => null;
}
