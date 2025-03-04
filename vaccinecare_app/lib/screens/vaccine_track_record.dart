import 'package:flutter/material.dart';

class VaccineDetailsPage extends StatefulWidget {
  final String babyName;
  final String birthDate;
  final String age;
  final String birthPlace;
  final String bloodGroup;
  final bool disabilityStatus;

  VaccineDetailsPage({
    required this.babyName,
    required this.birthDate,
    required this.age,
    required this.birthPlace,
    required this.bloodGroup,
    required this.disabilityStatus,
  });

  @override
  _VaccineDetailsPageState createState() => _VaccineDetailsPageState();
}

class _VaccineDetailsPageState extends State<VaccineDetailsPage> {
  // List of vaccines up to 3 years
  final List<Map<String, dynamic>> _vaccines = [
    {"name": "Hepatitis B - Dose 1", "age": "At Birth", "applied": false},
    {"name": "BCG", "age": "At Birth", "applied": false},
    {"name": "Polio - Dose 1", "age": "At Birth", "applied": false},
    {"name": "Hepatitis B - Dose 2", "age": "At 1 Month", "applied": false},
    {"name": "DTP - Dose 1", "age": "At 6 Weeks", "applied": false},
    {"name": "Polio - Dose 2", "age": "At 6 Weeks", "applied": false},
    {"name": "Rotavirus - Dose 1", "age": "At 6 Weeks", "applied": false},
    {"name": "DTP - Dose 2", "age": "At 10 Weeks", "applied": false},
    {"name": "Polio - Dose 3", "age": "At 10 Weeks", "applied": false},
    {"name": "Rotavirus - Dose 2", "age": "At 10 Weeks", "applied": false},
    {"name": "DTP - Dose 3", "age": "At 14 Weeks", "applied": false},
    {"name": "Polio - Dose 4", "age": "At 14 Weeks", "applied": false},
    {"name": "Hepatitis B - Dose 3", "age": "At 6 Months", "applied": false},
    {"name": "Measles - Dose 1", "age": "At 9 Months", "applied": false},
    {"name": "Vitamin A - Dose 1", "age": "At 9 Months", "applied": false},
    {"name": "DTP Booster 1", "age": "At 18 Months", "applied": false},
    {"name": "Polio Booster", "age": "At 18 Months", "applied": false},
    {"name": "Hepatitis A", "age": "At 18 Months", "applied": false},
    {"name": "Measles - Dose 2", "age": "At 2 Years", "applied": false},
    {"name": "Typhoid Vaccine", "age": "At 2 Years", "applied": false},
    {"name": "DTP Booster 2", "age": "At 3 Years", "applied": false},
  ];

  void _submitVaccinationData() {
    List<String> appliedVaccines = _vaccines
        .where((vaccine) => vaccine["applied"])
        .map((vaccine) => vaccine["name"].toString())
        .toList();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Vaccination Submission"),
        content: Text(
          "Baby: ${widget.babyName}\n"
          "Applied Vaccines:\n${appliedVaccines.join("\n")}",
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text("OK"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Vaccine Details")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Baby's Name: ${widget.babyName}",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text("Birth Date: ${widget.birthDate}", style: TextStyle(fontSize: 16)),
            Text("Age: ${widget.age}", style: TextStyle(fontSize: 16)),
            Text("Birth Place: ${widget.birthPlace}", style: TextStyle(fontSize: 16)),
            Text("Blood Group: ${widget.bloodGroup}", style: TextStyle(fontSize: 16)),
            Text(
              "Disability: ${widget.disabilityStatus ? 'Yes' : 'No'}",
              style: TextStyle(fontSize: 16, color: widget.disabilityStatus ? Colors.red : Colors.green),
            ),
            SizedBox(height: 20),
            Text("Vaccination Schedule:", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
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
              onPressed: _submitVaccinationData,
              child: Text("Submit"),
            ),
          ],
        ),
      ),
    );
  }
}
