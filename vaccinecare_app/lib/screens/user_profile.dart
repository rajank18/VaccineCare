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
  List<Map<String, dynamic>> babyData = [];
  bool isLoading = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    fetchUserProfile();
  }

  Future<void> fetchUserProfile() async {
    setState(() => isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final storedEmail = prefs.getString('user_email');
      if (storedEmail == null) {
        print("No stored email found!");
        setState(() => isLoading = false);
        return;
      }

      final response = await _supabase.from('users').select().eq('email', storedEmail).maybeSingle();
      if (response != null) {
        final babyResponse = await _supabase.from('babies').select().eq('parent_id', response['user_id']);
        setState(() {
          userData = response;
          babyData = List<Map<String, dynamic>>.from(babyResponse);
        });
      }
    } catch (error) {
      print("Error fetching user data: $error");
    }
    setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('User Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : userData == null
              ? Center(child: Text("No user data found", style: TextStyle(fontSize: 18)))
              : Padding(
                  padding: EdgeInsets.all(16),
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        Card(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 5,
                          child: Padding(
                            padding: EdgeInsets.all(16),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircleAvatar(
                                  radius: 50,
                                  backgroundColor: Colors.blueAccent,
                                  child: Icon(Icons.person, size: 50, color: Colors.white),
                                ),
                                SizedBox(height: 20),
                                _buildUserInfoTile("Name", userData!['name'], Icons.person),
                                _buildUserInfoTile("Email", userData!['email'], Icons.email),
                                _buildUserInfoTile("Phone", userData!['phone_number'], Icons.phone),
                                _buildUserInfoTile("Address", userData!['address'], Icons.home),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(height: 20),
                        babyData.isNotEmpty
                            ? Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text("Baby Details", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                  SizedBox(height: 10),
                                  ...babyData.map((baby) => Card(
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        elevation: 3,
                                        child: Padding(
                                          padding: EdgeInsets.all(12),
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              _buildUserInfoTile("Name", baby['name'], Icons.child_care),
                                              _buildUserInfoTile("Birth Date", baby['birth_date'], Icons.cake),
                                              _buildUserInfoTile("Gender", baby['gender'], Icons.wc),
                                              _buildUserInfoTile("Blood Group", baby['blood_group'] ?? "N/A", Icons.bloodtype),
                                            ],
                                          ),
                                        ),
                                      ))
                                ],
                              )
                            : Center(child: Text("No baby details found", style: TextStyle(fontSize: 16)))
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildUserInfoTile(String label, String value, IconData icon) {
    return Column(
      children: [
        ListTile(
          leading: Icon(icon, color: Colors.blueAccent),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Expanded(
                child: Align(
                  alignment: Alignment.centerRight,
                  child: Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87)),
                ),
              ),
            ],
          ),
        ),
        Divider(),
      ],
    );
  }
}
