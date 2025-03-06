import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class VaccineDetailsPage extends StatefulWidget {
  @override
  _VaccineDetailsPageState createState() => _VaccineDetailsPageState();
}

class _VaccineDetailsPageState extends State<VaccineDetailsPage> {
  List<Map<String, dynamic>> _vaccines = [
    {"name": "Hepatitis B - Dose 1", "age": "At Birth", "applied": true, "date": "2024-01-01", "expanded": false},
    {"name": "BCG", "age": "At Birth", "applied": true, "date": "2024-01-02", "expanded": false},
    {"name": "Polio - Dose 1", "age": "At Birth", "applied": false, "due": "In 2 weeks", "expanded": false},
    {"name": "DTP - Dose 1", "age": "At 6 Weeks", "applied": false, "due": "In 4 weeks", "expanded": false},
  ];

  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> appliedVaccines = _vaccines.where((v) => v['applied']).toList();
    List<Map<String, dynamic>> pendingVaccines = _vaccines.where((v) => !v['applied']).toList();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Vaccines Applied Till Now", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          SizedBox(height: 10),
          _buildVaccineList(appliedVaccines, Colors.green[100]!, "Date Applied: ", true),
          SizedBox(height: 20),
          Text("Vaccines To Be Applied", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          SizedBox(height: 10),
          _buildVaccineList(pendingVaccines, Colors.red[100]!, "Due In: ", false),
        ],
      ),
    );
  }

  Widget _buildVaccineList(List<Map<String, dynamic>> vaccines, Color color, String label, bool showPdf) {
    return Column(
      children: vaccines.map((vaccine) {
        return GestureDetector(
          onTap: () {
            setState(() {
              vaccine['expanded'] = !vaccine['expanded'];
            });
          },
          child: AnimatedContainer(
            duration: Duration(milliseconds: 300),
            margin: EdgeInsets.symmetric(vertical: 8),
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [BoxShadow(color: Colors.grey.shade300, blurRadius: 5)],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(vaccine['name'], style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    ),
                    if (showPdf) Icon(Icons.picture_as_pdf, color: Colors.blue),
                  ],
                ),
                SizedBox(height: 5),
                Text("$label ${vaccine["date"] ?? vaccine["due"]}", style: TextStyle(fontSize: 16, color: Colors.grey[700])),
                if (vaccine['expanded']) ...[
                  SizedBox(height: 10),
                  Text("More details about ${vaccine['name']}...", style: TextStyle(fontSize: 14, color: Colors.black54)),
                ],
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
