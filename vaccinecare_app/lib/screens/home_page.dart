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
  String selectedTab = 'remaining'; 
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _fetchVaccinationData();
  }

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
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: Text(
          "VaccineCare",
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: const Color.fromARGB(255, 40, 100, 202),
          ),
        ),
        
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.blue.shade50, Colors.blue.shade100],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: pages[_selectedIndex],
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
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        onTap: (index) => setState(() => _selectedIndex = index),
      ),
    );
  }

  Widget _buildHomePage() {
    return isLoading
        ? Center(child: CircularProgressIndicator())
        : Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildTabButton("Remaining", 'remaining'),
                    _buildTabButton("Completed", 'completed'),
                  ],
                ),
              ),
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
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: ExpansionTile(
                        title: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              vaccine['name'],
                              style: TextStyle(
                                  fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 4),
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
                            padding: EdgeInsets.all(16),
                            child: Text(
                              vaccine['description'],
                              style: TextStyle(fontSize: 16),
                            ),
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

  Widget _buildTabButton(String label, String tab) {
    return GestureDetector(
      onTap: () => setState(() => selectedTab = tab),
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        decoration: BoxDecoration(
          color: selectedTab == tab ? Colors.blue : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selectedTab == tab ? Colors.blue : Colors.grey,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 16,
            fontWeight:
                selectedTab == tab ? FontWeight.bold : FontWeight.normal,
            color: selectedTab == tab ? Colors.white : Colors.grey,
          ),
        ),
      ),
    );
  }
}
