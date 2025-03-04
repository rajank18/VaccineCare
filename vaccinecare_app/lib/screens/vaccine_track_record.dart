import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'home_page.dart'; // Import HomeScreen

class VaccineDetailsPage extends StatefulWidget {
  @override
  _VaccineDetailsPageState createState() => _VaccineDetailsPageState();
}

class _VaccineDetailsPageState extends State<VaccineDetailsPage> {
  List<Map<String, dynamic>> _vaccines = [
    {"name": "Hepatitis B - Dose 1", "age": "At Birth", "applied": false},
    {"name": "BCG", "age": "At Birth", "applied": false},
    {"name": "Polio - Dose 1", "age": "At Birth", "applied": false},
    {"name": "DTP - Dose 1", "age": "At 6 Weeks", "applied": false},
    {"name": "Polio - Dose 2", "age": "At 6 Weeks", "applied": false},
    {"name": "Rotavirus - Dose 1", "age": "At 6 Weeks", "applied": false},
    {"name": "Measles - Dose 1", "age": "At 9 Months", "applied": false},
    {"name": "DTP Booster 1", "age": "At 18 Months", "applied": false},
    {"name": "Polio Booster", "age": "At 18 Months", "applied": false},
    {"name": "Typhoid Vaccine", "age": "At 2 Years", "applied": false},
  ];

  Future<void> _saveVaccinationData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String> appliedVaccines = _vaccines
        .where((v) => v["applied"])
        .map((v) => v["name"].toString())
        .toList();
    await prefs.setStringList('checkedVaccines', appliedVaccines);
  }

  void _submitVaccinationData(BuildContext context) async {
    await _saveVaccinationData();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Vaccine data saved! Returning to Home..."),
        duration: Duration(seconds: 2),
      ),
    );

    // Wait 2 seconds and then return to HomeScreen
    Future.delayed(Duration(seconds: 2), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => HomeScreen()),
      );
    });
  }

  @override
  void initState() {
    super.initState();
    _loadVaccineData();
  }

  Future<void> _loadVaccineData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String> checkedVaccines = prefs.getStringList('checkedVaccines') ?? [];
    setState(() {
      for (var vaccine in _vaccines) {
        if (checkedVaccines.contains(vaccine["name"])) {
          vaccine["applied"] = true;
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Vaccine Tracker")),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _vaccines.length,
              itemBuilder: (context, index) {
                return CheckboxListTile(
                  title: Text(_vaccines[index]["name"]),
                  subtitle: Text("Recommended: ${_vaccines[index]["age"]}"),
                  value: _vaccines[index]["applied"],
                  onChanged: (bool? value) {
                    setState(() {
                      _vaccines[index]["applied"] = value!;
                    });
                  },
                );
              },
            ),
          ),
          SizedBox(height: 10),
          ElevatedButton(
            onPressed: () => _submitVaccinationData(context),
            style: ElevatedButton.styleFrom(
              minimumSize: Size(double.infinity, 50),
            ),
            child: Text("Submit & Return to Home", style: TextStyle(fontSize: 18)),
          ),
          SizedBox(height: 20),
        ],
      ),
    );
  }
}
