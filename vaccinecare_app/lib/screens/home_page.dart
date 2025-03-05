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
  int _selectedIndex = 0;
  List<String> _checkedVaccines = [];
  
  final List<String> _titles = ["Home", "Vaccine Tracker", "Profile"]; 

  Future<void> logout(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('checkedVaccines'); // FIX: Clears stored vaccine data on logout

    await _supabase.auth.signOut();
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => AuthScreen()));
  }

  @override
  void initState() {
    super.initState();
    _loadVaccineData();
  }

  Future<void> _loadVaccineData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      _checkedVaccines = prefs.getStringList('checkedVaccines') ?? [];
    });
  }

  final List<Widget> _pages = [
    HomePageContent(),
    VaccineDetailsPage(),
    UserProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_selectedIndex]),
        actions: [
          IconButton(
            icon: Icon(Icons.power_settings_new), // Power icon for logout
            onPressed: () => logout(context),
          ),
        ],
      ),
      body: _selectedIndex == 0 ? HomePageContent(vaccines: _checkedVaccines) : _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) async {
          if (index == 0) {
            await _loadVaccineData();
          }
          setState(() {
            _selectedIndex = index;
          });
        },
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.vaccines), label: 'Tracker'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

// Home Page Content with Vaccine Summary
class HomePageContent extends StatelessWidget {
  final List<String> vaccines;

  HomePageContent({this.vaccines = const []});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Welcome to Vaccine Care!", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          SizedBox(height: 10),
          Text("Vaccines Applied:", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          Expanded(
            child: vaccines.isEmpty
                ? Center(child: Text("No vaccines selected yet.", style: TextStyle(fontSize: 16, color: Colors.grey)))
                : ListView.builder(
                    itemCount: vaccines.length,
                    itemBuilder: (context, index) {
                      return ListTile(
                        leading: Icon(Icons.check_circle, color: Colors.green),
                        title: Text(vaccines[index]),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
