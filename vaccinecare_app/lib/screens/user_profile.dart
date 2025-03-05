import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class UserProfilePage extends StatefulWidget {
  @override
  _UserProfilePageState createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  final SupabaseClient supabase = Supabase.instance.client;
  Map<String, dynamic>? userData;
  Map<String, dynamic>? babyData;

  @override
  void initState() {
    super.initState();
    fetchUserProfile();
  }

  Future<void> fetchUserProfile() async {
    try {
      final user = supabase.auth.currentUser;
      if (user == null) return;

      final response = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email!)
          .single();

      final babyResponse = await supabase
          .from('babies')
          .select('*')
          .eq('parent_id', response['user_id'])
          .maybeSingle();

      setState(() {
        userData = response;
        babyData = babyResponse;
      });
    } catch (error) {
      print('Error fetching profile: $error');
    }
  }

  void logout() async {
    await supabase.auth.signOut();
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('User Profile'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: logout,
          ),
        ],
      ),
      body: userData == null
          ? Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: CircleAvatar(
                      radius: 50,
                      backgroundImage: AssetImage('assets/default_user.png'),
                    ),
                  ),
                  SizedBox(height: 20),
                  Text('Parent Name: ${userData!['name']}',
                      style: TextStyle(fontSize: 18)),
                  Text('Email: ${userData!['email']}',
                      style: TextStyle(fontSize: 18)),
                  Text('Phone: ${userData!['phone_number']}',
                      style: TextStyle(fontSize: 18)),
                  Text('Address: ${userData!['address'] ?? "N/A"}',
                      style: TextStyle(fontSize: 18)),
                  SizedBox(height: 20),
                  Divider(),
                  Text('Baby Details',
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  babyData != null
                      ? Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Name: ${babyData!['name']}',
                                style: TextStyle(fontSize: 18)),
                            Text('Birth Date: ${babyData!['birth_date']}',
                                style: TextStyle(fontSize: 18)),
                            Text('Gender: ${babyData!['gender']}',
                                style: TextStyle(fontSize: 18)),
                            Text(
                                'Blood Group: ${babyData!['blood_group'] ?? "N/A"}',
                                style: TextStyle(fontSize: 18)),
                          ],
                        )
                      : Text('No baby data found',
                          style: TextStyle(fontSize: 18)),
                ],
              ),
            ),
    );
  }
}
