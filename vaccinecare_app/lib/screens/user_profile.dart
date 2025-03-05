import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

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

  /// ✅ Fetch User Data from Supabase Auth & Users Table
  Future<void> fetchUserProfile() async {
    try {
      // ✅ Fetch authenticated user from Supabase
      final userResponse = await _supabase.auth.getUser();
      final user = userResponse.user;

      if (user == null) {
        print("⚠️ No user session found!");
        setState(() => isLoading = false);
        return;
      }

      print("✅ Logged-in User ID: ${user.id}"); // Debugging

      // ✅ Fetch user details from `users` table
      final response = await _supabase
          .from('users')
          .select()
          .eq('user_id', user.id)
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
