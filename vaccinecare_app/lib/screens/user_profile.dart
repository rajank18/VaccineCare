import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserProfilePage extends StatefulWidget {
  @override
  _UserProfilePageState createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  final _supabase = Supabase.instance.client;
  Map<String, dynamic>? userData;
  bool isLoading = true;

  @override
  void didChangeDependencies() { 
    super.didChangeDependencies();
    fetchUserProfile();
  }

  /// ✅ Fetch User Data Using Stored Email
  Future<void> fetchUserProfile() async {
    setState(() => isLoading = true);

    try {
      // ✅ Retrieve stored email
      final prefs = await SharedPreferences.getInstance();
      final storedEmail = prefs.getString('user_email');

      if (storedEmail == null) {
        print("⚠️ No stored email found!");
        setState(() => isLoading = false);
        return;
      }

      print("✅ Fetching user data for email: $storedEmail");

      // ✅ Fetch user details from `users` table using email
      final response = await _supabase
          .from('users')
          .select()
          .eq('email', storedEmail) // 🔹 Use email instead of session
          .maybeSingle();

      if (response != null) {
        setState(() {
          userData = response;
          isLoading = false;
        });
      } else {
        setState(() => isLoading = false);
        print("⚠️ User data not found in `users` table!");
      }
    } catch (error) {
      setState(() => isLoading = false);
      print("❌ Error fetching user data: $error");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('User Profile')),
      body: isLoading
          ? Center(child: CircularProgressIndicator()) 
          : userData == null
              ? Center(child: Text("No user data found")) 
              : Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Name: ${userData!['name']}", style: TextStyle(fontSize: 18)),
                      SizedBox(height: 10),
                      Text("Email: ${userData!['email']}", style: TextStyle(fontSize: 18)),
                      SizedBox(height: 10),
                      Text("Phone: ${userData!['phone_number']}", style: TextStyle(fontSize: 18)),
                      SizedBox(height: 10),
                      Text("Address: ${userData!['address']}", style: TextStyle(fontSize: 18)),
                    ],
                  ),
                ),
    );
  }
}
