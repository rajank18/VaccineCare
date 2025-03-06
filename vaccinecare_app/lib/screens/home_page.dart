import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_page.dart';
import 'vaccine_track_record.dart';
import 'user_profile.dart';
import 'dart:async';


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
// Home Page Content with Vaccine Summary and Education Slider

class HomePageContent extends StatefulWidget {
  final List<String> vaccines;

  HomePageContent({this.vaccines = const []});

  @override
  _HomePageContentState createState() => _HomePageContentState();
}

class _HomePageContentState extends State<HomePageContent> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  Timer? _timer;

  final List<String> educationSlides = [
    "Vaccines help prevent serious diseases like polio, measles, and COVID-19.",
    "Getting vaccinated protects not just you, but also those around you.",
    "Vaccines are tested for safety and effectiveness before approval.",
    "Some vaccines require booster doses for long-term immunity.",
    "Side effects of vaccines are usually mild and temporary."
  ];

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
  }

  void _startAutoSlide() {
    _timer = Timer.periodic(Duration(seconds: 3), (timer) {
      if (_currentPage < educationSlides.length - 1) {
        _currentPage++;
      } else {
        _currentPage = 0; // Reset to first slide
      }
      _pageController.animateToPage(
        _currentPage,
        duration: Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Education Slider Section
          SizedBox(
            height: 150,
            child: PageView.builder(
              controller: _pageController,
              itemCount: educationSlides.length,
              onPageChanged: (index) {
                setState(() {
                  _currentPage = index;
                });
              },
              itemBuilder: (context, index) {
                return Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Center(
                      child: Text(
                        educationSlides[index],
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          SizedBox(height: 10),

          // Dots Indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              educationSlides.length,
              (index) => Container(
                margin: EdgeInsets.symmetric(horizontal: 4),
                width: _currentPage == index ? 10 : 6,
                height: _currentPage == index ? 10 : 6,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _currentPage == index ? Colors.blue : Colors.grey,
                ),
              ),
            ),
          ),

          SizedBox(height: 20),

          // Vaccine Summary Section
          Text("Vaccines Applied:", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          Expanded(
            child: widget.vaccines.isEmpty
                ? Center(child: Text("No vaccines selected yet.", style: TextStyle(fontSize: 16, color: Colors.grey)))
                : ListView.builder(
                    itemCount: widget.vaccines.length,
                    itemBuilder: (context, index) {
                      return ListTile(
                        leading: Icon(Icons.check_circle, color: Colors.green),
                        title: Text(widget.vaccines[index]),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}