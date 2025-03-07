import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:vaccinecare_app/screens/auth_page.dart';
import '../screens/home_page.dart';
import 'package:intl/intl.dart';

class BabyDetailsPage extends StatefulWidget {
  final String parentId; 

  BabyDetailsPage({required this.parentId});

  @override
  _BabyDetailsPageState createState() => _BabyDetailsPageState();
}

class _BabyDetailsPageState extends State<BabyDetailsPage> {
  final _supabase = Supabase.instance.client;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _birthDateController = TextEditingController();
  final TextEditingController _birthPlaceController = TextEditingController();
  
  String? _gender; 
  String? _bloodGroup;
  bool _hasDisability = false;

  Future<void> _selectBirthDate(BuildContext context) async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
    );

    if (pickedDate != null) {
      _birthDateController.text = DateFormat('yyyy-MM-dd').format(pickedDate);
    }
  }

  Future<void> _submitForm() async {
    if (_nameController.text.isEmpty ||
        _birthDateController.text.isEmpty ||
        _birthPlaceController.text.isEmpty ||
        _gender == null ||
        _bloodGroup == null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Please fill all fields")));
      return;
    }

    try {
      await _supabase.from('babies').insert({
        'parent_id': widget.parentId, 
        'name': _nameController.text,
        'birth_date': _birthDateController.text,
        'birthplace': _birthPlaceController.text,
        'gender': _gender, 
        'blood_group': _bloodGroup,
        'health_score': 0, 
        'is_disabled': _hasDisability,
        'created_at': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
      });

      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Baby details saved successfully!")));
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => AuthScreen()));
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Baby Details Form")),
      body: Padding(
        padding: EdgeInsets.all(16),
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
                value: _gender,
                items: ['male', 'female', 'other']
                    .map((gen) => DropdownMenuItem(value: gen, child: Text(gen.toUpperCase())))
                    .toList(),
                onChanged: (value) => setState(() => _gender = value),
                decoration: InputDecoration(labelText: "Gender"),
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
                    onChanged: (value) => setState(() => _hasDisability = value!),
                  ),
                ],
              ),

              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _submitForm,
                child: Text("Next: Home"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}


  @override
  Widget build(BuildContext context) {
    throw UnimplementedError();
  }