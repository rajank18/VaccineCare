import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_page.dart';
import 'vaccine_track_record.dart';
import 'user_profile.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _supabase = Supabase.instance.client;
  bool isLoading = true;
  List<Map<String, dynamic>> completedVaccines = [];
  List<Map<String, dynamic>> remainingVaccines = [];
  String selectedTab = 'remaining'; // Default to Remaining Vaccines
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _fetchVaccinationData();
  }

  Future<void> _fetchVaccinationData() async {
    setState(() => isLoading = true);

    try {
      // ✅ Get Stored Email
      final prefs = await SharedPreferences.getInstance();
      final storedEmail = prefs.getString('user_email');
      if (storedEmail == null) {
        print("⚠️ No email found in SharedPreferences");
        return;
      }

      // ✅ Find Parent ID
      final userResponse = await _supabase
          .from('users')
          .select('user_id')
          .eq('email', storedEmail)
          .maybeSingle();

      if (userResponse == null) {
        print("⚠️ Parent not found for email: $storedEmail");
        return;
      }
      String parentId = userResponse['user_id'];

      // ✅ Get Baby ID
      final babyResponse = await _supabase
          .from('babies')
          .select('baby_id')
          .eq('parent_id', parentId)
          .maybeSingle();

      if (babyResponse == null) {
        print("⚠️ No baby found for parent: $parentId");
        return;
      }
      String babyId = babyResponse['baby_id'];

      // ✅ Fetch All Vaccines Sorted by Age Group
      final vaccineResponse = await _supabase
          .from('vaccines')
          .select()
          .order('age_group', ascending: true);

      List<Map<String, dynamic>> allVaccines = List<Map<String, dynamic>>.from(vaccineResponse);

      // ✅ Fetch Completed Vaccines
      final completedResponse = await _supabase
          .from('vaccination_records')
          .select('vaccine_id')
          .eq('baby_id', babyId);

      List<String> completedIds = completedResponse.map<String>((v) => v['vaccine_id'].toString()).toList();

      // ✅ Separate Completed & Remaining
      completedVaccines = allVaccines.where((v) => completedIds.contains(v['vaccine_id'])).toList();
      remainingVaccines = allVaccines.where((v) => !completedIds.contains(v['vaccine_id'])).toList();
    } catch (error) {
      print("❌ Error fetching vaccination data: $error");
    }

    setState(() => isLoading = false);
  }

  void _onItemTapped(int index) {
    if (index == _selectedIndex) return; // Prevent unnecessary navigation

    switch (index) {
      case 0:
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => HomeScreen()));
        break;
      case 1:
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => VaccinationRecordsPage()));
        break;
      case 2:
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => UserProfilePage()));
        break;
    }
  }

  void _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_email'); // Remove stored email
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => AuthScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("VaccineCare"),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // ✅ Toggle Buttons for Filtering
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextButton(
                      onPressed: () => setState(() => selectedTab = 'remaining'),
                      child: Text("Remaining Vaccines",
                          style: TextStyle(fontSize: 18, fontWeight: selectedTab == 'remaining' ? FontWeight.bold : FontWeight.normal)),
                    ),
                    TextButton(
                      onPressed: () => setState(() => selectedTab = 'completed'),
                      child: Text("Completed Vaccines",
                          style: TextStyle(fontSize: 18, fontWeight: selectedTab == 'completed' ? FontWeight.bold : FontWeight.normal)),
                    ),
                  ],
                ),

                // ✅ Vaccine List
                Expanded(
                  child: ListView.builder(
                    itemCount: selectedTab == 'remaining' ? remainingVaccines.length : completedVaccines.length,
                    itemBuilder: (context, index) {
                      final vaccine = selectedTab == 'remaining' ? remainingVaccines[index] : completedVaccines[index];
                      return Card(
                        margin: EdgeInsets.all(8),
                        child: ListTile(
                          title: Text(vaccine['name'], style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          subtitle: Text("Age Group: ${vaccine['age_group']}\n${vaccine['description']}"),
                          trailing: Icon(
                            selectedTab == 'remaining' ? Icons.schedule : Icons.check_circle,
                            color: selectedTab == 'remaining' ? Colors.orange : Colors.green,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list),
            label: 'Track Record',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}
