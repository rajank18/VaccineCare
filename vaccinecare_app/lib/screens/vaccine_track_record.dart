import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

class VaccinationRecordsPage extends StatefulWidget {
  @override
  _VaccinationRecordsPageState createState() => _VaccinationRecordsPageState();
}

class _VaccinationRecordsPageState extends State<VaccinationRecordsPage> {
  final _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> vaccinationRecords = [];
  bool isLoading = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    fetchVaccinationRecords();
  }

  /// ✅ Fetch Vaccination Records
  Future<void> fetchVaccinationRecords() async {
    setState(() => isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final storedEmail = prefs.getString('user_email');
      if (storedEmail == null) {
        print("⚠️ No stored email found!");
        setState(() => isLoading = false);
        return;
      }

      final userResponse = await _supabase
          .from('users')
          .select('user_id')
          .eq('email', storedEmail)
          .maybeSingle();
      if (userResponse == null) {
        print("⚠️ User not found!");
        setState(() => isLoading = false);
        return;
      }

      final String userId = userResponse['user_id'];
      final babyResponse = await _supabase
          .from('babies')
          .select('baby_id')
          .eq('parent_id', userId)
          .maybeSingle();
      if (babyResponse == null) {
        print("⚠️ No baby record found!");
        setState(() => isLoading = false);
        return;
      }

      final String babyId = babyResponse['baby_id'];
      final vaccineResponse = await _supabase
          .from('vaccination_records')
          .select('''
            record_id,
            dose_number,
            date_administered,
            certificate_url,
            created_at
          ''')
          .eq('baby_id', babyId)
          .order('date_administered', ascending: true);

      setState(() {
        vaccinationRecords = List<Map<String, dynamic>>.from(vaccineResponse);
        isLoading = false;
      });
    } catch (error) {
      setState(() => isLoading = false);
      print("❌ Error fetching vaccination details: $error");
    }
  }

  /// ✅ Function to launch URL
Future<void> _launchURL(String url) async {
  final Uri uri = Uri.parse(url);
  
  if (await canLaunchUrl(uri)) {
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  } else {
    print("❌ Could not launch $url");
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Could not open the link. Please check your internet or try another browser."))
    );
  }
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Vaccination Records')),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : vaccinationRecords.isEmpty
              ? Center(child: Text("No vaccination records found"))
              : ListView.builder(
                  itemCount: vaccinationRecords.length,
                  itemBuilder: (context, index) {
                    final record = vaccinationRecords[index];
                    return Card(
                      margin: EdgeInsets.all(10),
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text("💉 Dose Number: ${record['dose_number']}",
                                style: TextStyle(fontSize: 16)),
                            SizedBox(height: 8),
                            Text("📅 Date Administered: ${record['date_administered']}",
                                style: TextStyle(fontSize: 16)),
                            SizedBox(height: 8),
                            Text("🕒 Created At: ${record['created_at']}",
                                style: TextStyle(fontSize: 16)),
                            SizedBox(height: 8),
                            
                            // 🔹 Clickable Certificate URL
                            record['certificate_url'] != null
                                ? GestureDetector(
                                    onTap: () => _launchURL(record['certificate_url']),
                                    child: Text(
                                      "📄 View Certificate",
                                      style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.blue,
                                        decoration: TextDecoration.underline,
                                      ),
                                    ),
                                  )
                                : Text("📄 Certificate: Not Available", style: TextStyle(fontSize: 16)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
