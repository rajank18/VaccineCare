import 'package:flutter/material.dart';
// ignore: depend_on_referenced_packages
import 'package:intl/intl.dart';
import 'package:vaccinecare_app/screens/home_page.dart';
import 'vaccine_track_record.dart';

class BabyDetailsPage extends StatefulWidget {
  @override
  _BabyDetailsPageState createState() => _BabyDetailsPageState();
}

class _BabyDetailsPageState extends State<BabyDetailsPage> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _birthDateController = TextEditingController();
  final TextEditingController _birthPlaceController = TextEditingController();
  String? _bloodGroup;
  bool _hasDisability = false;
  String? _age;

  void _calculateAge(DateTime birthDate) {
    final today = DateTime.now();
    int years = today.year - birthDate.year;
    int months = today.month - birthDate.month;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    setState(() {
      _age = "$years years, $months months";
    });
  }

  Future<void> _selectBirthDate(BuildContext context) async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
    );

    if (pickedDate != null) {
      _birthDateController.text = DateFormat('yyyy-MM-dd').format(pickedDate);
      _calculateAge(pickedDate);
    }
  }

  void _submitForm() {
    if (_nameController.text.isNotEmpty &&
        _birthDateController.text.isNotEmpty &&
        _birthPlaceController.text.isNotEmpty &&
        _bloodGroup != null) {
      // Navigate to Vaccine Details Page after successful form submission
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => HomeScreen()
            // VaccineDetailsPage(
            //   babyName: _nameController.text,
            //   birthDate: _birthDateController.text,
            //   age: _age ?? "N/A",
            //   birthPlace: _birthPlaceController.text,
            //   bloodGroup: _bloodGroup!,
            //   disabilityStatus: _hasDisability,
            // ),
            ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please fill all fields")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Baby Details Form")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              TextField(
                controller: _nameController,
                decoration: InputDecoration(labelText: "Baby's Name"),
              ),
              TextField(
                controller: _birthDateController,
                readOnly: true,
                decoration: InputDecoration(labelText: "Birth Date"),
                onTap: () => _selectBirthDate(context),
              ),
              TextField(
                controller: _birthPlaceController,
                decoration: InputDecoration(labelText: "Birth Place"),
              ),
              DropdownButtonFormField<String>(
                value: _bloodGroup,
                items: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
                    .map(
                        (grp) => DropdownMenuItem(value: grp, child: Text(grp)))
                    .toList(),
                onChanged: (value) => setState(() => _bloodGroup = value),
                decoration: InputDecoration(labelText: "Blood Group"),
              ),
              Row(
                children: [
                  Text("Disability:"),
                  Checkbox(
                    value: _hasDisability,
                    onChanged: (value) {
                      setState(() {
                        _hasDisability = value!;
                      });
                    },
                  ),
                ],
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _submitForm,
                child: Text("Next: Home Page"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
