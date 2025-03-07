import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vaccinecare_app/screens/auth_page.dart';
import 'package:vaccinecare_app/screens/vaccine_track_record.dart';

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
        setState(() => isLoading = false);
        return;
      }

      final response = await _supabase
          .from('users')
          .select()
          .eq('email', storedEmail)
          .maybeSingle();
      if (response != null) {
        final babyResponse = await _supabase
            .from('babies')
            .select()
            .eq('parent_id', response['user_id']);
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

  Future<void> signOut() async {
    await _supabase.auth.signOut();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_email');

    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
            builder: (context) => AuthScreen()), 
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.blue.shade100,
              const Color.fromARGB(255, 235, 235, 235)
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: isLoading
              ? Center(child: CircularProgressIndicator())
              : userData == null
                  ? Center(
                      child: Text("No user data found",
                          style: TextStyle(fontSize: 18, color: Colors.white)))
                  : Padding(
                      padding: EdgeInsets.all(16),
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                IconButton(
                                  icon: Icon(Icons.power_settings_new,
                                      color: Colors.white, size: 30),
                                  onPressed: signOut,
                                ),
                              ],
                            ),
                            CircleAvatar(
                              radius: 50,
                              backgroundColor: Colors.white,
                              child: Icon(Icons.person,
                                  size: 50, color: Colors.blue[900]),
                            ),
                            SizedBox(height: 20),
                            _buildCard([
                              _buildUserInfoTile("Parent Name",
                                  userData!['name'], Icons.person),
                              _buildUserInfoTile(
                                  "Email", userData!['email'], Icons.email),
                              _buildUserInfoTile("Phone",
                                  userData!['phone_number'], Icons.phone),
                              _buildUserInfoTile(
                                  "Address", userData!['address'], Icons.home),
                            ]),
                            SizedBox(height: 20),
                            babyData.isNotEmpty
                                ? Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text("Baby Details",
                                          style: TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                              color: const Color.fromARGB(
                                                  255, 7, 5, 5))),
                                      SizedBox(height: 10),
                                      ...babyData.map((baby) => _buildCard([
                                            _buildUserInfoTile("Name",
                                                baby['name'], Icons.child_care),
                                            _buildUserInfoTile("Birth Date",
                                                baby['birth_date'], Icons.cake),
                                            _buildUserInfoTile("Gender",
                                                baby['gender'], Icons.wc),
                                            _buildUserInfoTile(
                                                "Blood Group",
                                                baby['blood_group'] ?? "N/A",
                                                Icons.bloodtype),
                                          ]))
                                    ],
                                  )
                                : Center(
                                    child: Text("No baby details found",
                                        style: TextStyle(
                                            fontSize: 16, color: Colors.white)))
                          ],
                        ),
                      ),
                    ),
        ),
      ),
    );
  }

  Widget _buildCard(List<Widget> children) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 5,
      color: Colors.white.withOpacity(0.9),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(children: children),
      ),
    );
  }

  Widget _buildUserInfoTile(String label, String value, IconData icon) {
    return Column(
      children: [
        ListTile(
          leading: Icon(icon, color: Colors.blue[900]),
          title: Text(
            label,
            style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 15,
                color: Colors.black87),
          ),
          subtitle: Text(
            value,
            style: TextStyle(
                fontSize: 14, fontWeight: FontWeight.w500, color: Colors.black),
            overflow: TextOverflow.ellipsis,
            maxLines: 2,
          ),
        ),
        Divider(),
      ],
    );
  }
}
