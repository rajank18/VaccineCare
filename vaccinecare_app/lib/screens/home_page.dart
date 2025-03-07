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
  int _selectedIndex = 0; // Track selected tab

  @override
  void initState() {
    super.initState();
    _fetchVaccinationData();
  }

  /// ✅ Convert Age Group to Comparable Number for Sorting
  int _convertAgeToNumber(String ageGroup) {
    if (ageGroup.toLowerCase() == "birth") return 0;

    final RegExp weekRegex = RegExp(r"(\d+)\s*weeks?");
    final RegExp monthRegex = RegExp(r"(\d+)\s*months?");
    final RegExp yearRegex = RegExp(r"(\d+)\s*years?");

    if (weekRegex.hasMatch(ageGroup)) {
      return int.parse(weekRegex.firstMatch(ageGroup)!.group(1)!) * 7;
    }

    if (monthRegex.hasMatch(ageGroup)) {
      return int.parse(monthRegex.firstMatch(ageGroup)!.group(1)!) * 30;
    }

    if (yearRegex.hasMatch(ageGroup)) {
      return int.parse(yearRegex.firstMatch(ageGroup)!.group(1)!) * 365;
    }

    return 99999;
  }

  /// ✅ Fetch Vaccination Data
  Future<void> _fetchVaccinationData() async {
    setState(() => isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final storedEmail = prefs.getString('user_email');
      if (storedEmail == null) return;

      final userResponse = await _supabase
          .from('users')
          .select('user_id')
          .eq('email', storedEmail)
          .maybeSingle();

      if (userResponse == null) return;
      String parentId = userResponse['user_id'];

      final babyResponse = await _supabase
          .from('babies')
          .select('baby_id')
          .eq('parent_id', parentId)
          .maybeSingle();

      if (babyResponse == null) return;
      String babyId = babyResponse['baby_id'];

      final vaccineResponse = await _supabase.from('vaccines').select();

      List<Map<String, dynamic>> allVaccines =
          List<Map<String, dynamic>>.from(vaccineResponse);
      allVaccines.sort((a, b) => _convertAgeToNumber(a['age_group'])
          .compareTo(_convertAgeToNumber(b['age_group'])));

      final completedResponse = await _supabase
          .from('vaccination_records')
          .select('vaccine_id')
          .eq('baby_id', babyId);

      List<String> completedIds = completedResponse
          .map<String>((v) => v['vaccine_id'].toString())
          .toList();

      completedVaccines = allVaccines
          .where((v) => completedIds.contains(v['vaccine_id']))
          .toList();
      remainingVaccines = allVaccines
          .where((v) => !completedIds.contains(v['vaccine_id']))
          .toList();
    } catch (error) {
      print("❌ Error fetching vaccination data: $error");
    }

    setState(() => isLoading = false);
  }

  /// ✅ Logout Function
  void _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_email');
    Navigator.pushReplacement(
        context, MaterialPageRoute(builder: (context) => AuthScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      _buildHomePage(),
      VaccinationRecordsPage(),
      UserProfilePage(),
    ];

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
      body: pages[_selectedIndex],
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
        onTap: (index) => setState(() => _selectedIndex = index),
      ),
    );
  }

  /// ✅ Build Home Page with Vaccine List
  Widget _buildHomePage() {
    return isLoading
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
                        style: TextStyle(
                            fontSize: 18,
                            fontWeight: selectedTab == 'remaining'
                                ? FontWeight.bold
                                : FontWeight.normal)),
                  ),
                  TextButton(
                    onPressed: () => setState(() => selectedTab = 'completed'),
                    child: Text("Completed Vaccines",
                        style: TextStyle(
                            fontSize: 18,
                            fontWeight: selectedTab == 'completed'
                                ? FontWeight.bold
                                : FontWeight.normal)),
                  ),
                ],
              ),

              // ✅ Vaccine List with Icons
              Expanded(
                child: ListView.builder(
                  itemCount: selectedTab == 'remaining'
                      ? remainingVaccines.length
                      : completedVaccines.length,
                  itemBuilder: (context, index) {
                    final vaccine = selectedTab == 'remaining'
                        ? remainingVaccines[index]
                        : completedVaccines[index];

                    return Card(
                      margin: EdgeInsets.all(8),
                      child: ExpansionTile(
                        title: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // ✅ Vaccine Name (Symbols Retained)
                            Text(
                              vaccine['name'],
                              style: TextStyle(
                                  fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            // ✅ Age Group
                            Text(
                              "Age Group: ${vaccine['age_group']}",
                              style: TextStyle(
                                  fontSize: 16, color: Colors.grey[600]),
                            ),
                          ],
                        ),
                        trailing: Icon(
                          selectedTab == 'remaining'
                              ? Icons.schedule
                              : Icons.check_circle,
                          color: selectedTab == 'remaining'
                              ? Colors.orange
                              : Colors.green,
                        ),
                        children: [
                          Padding(
                            padding: EdgeInsets.all(10),
                            child: Text(vaccine['description']),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          );
  }
}
