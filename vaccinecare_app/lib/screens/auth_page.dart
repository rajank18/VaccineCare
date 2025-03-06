import 'package:flutter/material.dart';
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

  /// Hashes the password before storing in the database
  String hashPassword(String password) {
    var bytes = utf8.encode(password); 
    var digest = sha256.convert(bytes);
    return digest.toString();
  }

  /// **Check if baby details exist for this parent**
  Future<void> checkBabyDetailsAndNavigate(String parentId) async {
    final response = await _supabase
        .from('babies')
        .select()
        .eq('parent_id', parentId)
        .maybeSingle();

    if (response != null) {
      // ✅ Baby details exist → Go to HomeScreen
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => HomeScreen()));
    } else {
      // ❌ No baby details → Go to BabyDetailsPage
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => BabyDetailsPage(parentId: parentId)));
    }
  }

  Future<void> authenticateUser() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    try {
      if (isLogin) {
        // ✅ Login User
        final response = await _supabase
            .from('users')
            .select()
            .eq('email', email)
            .eq('password_hash', hashPassword(password))
            .maybeSingle();

        if (response != null) {
          String parentId = response['user_id'];
          await checkBabyDetailsAndNavigate(parentId); // ✅ Check and redirect
        } else {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Invalid email or password')));
        }
      } else {
        // ✅ Sign-Up User
        final response = await _supabase.auth.signUp(email: email, password: password);
        if (response.user != null) {
          await _supabase.from('users').insert({
            'user_id': response.user!.id,
            'name': name,
            'email': email,
            'phone_number': phone,
            'address': address,
            'password_hash': hashPassword(password),
            'created_at': DateTime.now().toIso8601String(),
            'updated_at': DateTime.now().toIso8601String(),
          });

          // ✅ New user → Go to BabyDetailsPage
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => BabyDetailsPage(parentId: response.user!.id)),
          );
        }
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(isLogin ? 'Login' : 'Sign Up')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              if (!isLogin) TextFormField(
                decoration: InputDecoration(labelText: 'Full Name'),
                validator: (val) => val!.isEmpty ? 'Enter your name' : null,
                onSaved: (val) => name = val!,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Email'),
                keyboardType: TextInputType.emailAddress,
                validator: (val) => val!.isEmpty ? 'Enter a valid email' : null,
                onSaved: (val) => email = val!,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Phone Number'),
                keyboardType: TextInputType.phone,
                validator: (val) => val!.length < 10 ? 'Enter a valid phone number' : null,
                onSaved: (val) => phone = val!,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: (val) => val!.length < 6 ? 'Password too short' : null,
                onSaved: (val) => password = val!,
              ),
              if (!isLogin) TextFormField(
                decoration: InputDecoration(labelText: 'Address'),
                validator: (val) => val!.isEmpty ? 'Enter your address' : null,
                onSaved: (val) => address = val!,
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: authenticateUser,
                child: Text(isLogin ? 'Login' : 'Sign Up'),
              ),
              TextButton(
                onPressed: () => setState(() => isLogin = !isLogin),
                child: Text(isLogin ? 'Create an Account' : 'Already have an account? Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}