import 'package:flutter/material.dart';
import 'api_service.dart';

void main() {
  runApp(const CoOpConnectApp());
}

class CoOpConnectApp extends StatelessWidget {
  const CoOpConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CO-OP CONNECT | AI Platform',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate 900
        colorScheme: ColorScheme.dark(
          primary: const Color(0xFF6366F1), // Indigo 500
          secondary: const Color(0xFF38BDF8), // Sky 400
          surface: const Color(0xFF1E293B), // Slate 800
        ),
        useMaterial3: true,
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String _activeTaskName = "System Idle";
  dynamic _parsedResult;
  bool _isLoading = false;

  String _selectedService = 'electrician';
  final TextEditingController _basePriceController = TextEditingController(text: "500.0");

  void _runTask(String taskName, Future<dynamic> Function() task) async {
    setState(() {
      _isLoading = true;
      _activeTaskName = taskName;
      _parsedResult = null;
    });
    try {
      final result = await task();
      setState(() {
        _parsedResult = result;
      });
    } catch (e) {
      setState(() {
        _parsedResult = "Error connecting to backend API: $e";
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Wave Header Section
          Stack(
            children: [
              ClipPath(
                clipper: WaveHeaderClipper(),
                child: Container(
                  height: 180,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF4F46E5), Color(0xFF0284C7)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                ),
              ),
              Positioned.fill(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "CO-OP CONNECT",
                            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, letterSpacing: 1.2, color: Colors.white),
                          ),
                          SizedBox(height: 4),
                          Text(
                            "AI-Powered Worker Allocation & Demand Engine",
                            style: TextStyle(fontSize: 13, color: Colors.white70),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.white30),
                        ),
                        child: const Row(
                          children: [
                            CircleAvatar(radius: 5, backgroundColor: Color(0xFF4ADE80)),
                            SizedBox(width: 8),
                            Text("FastAPI Active", style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Main Workspace Layout
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Left Control Panel
                  SizedBox(
                    width: 340,
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildSectionTitle("Target Parameters"),
                          const SizedBox(height: 12),
                          DropdownButtonFormField<String>(
                            initialValue: _selectedService,
                            dropdownColor: const Color(0xFF1E293B),
                            decoration: InputDecoration(
                              labelText: "Service Category",
                              filled: true,
                              fillColor: const Color(0xFF1E293B),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            items: ['electrician', 'plumber', 'carpenter']
                                .map((s) => DropdownMenuItem(value: s, child: Text(s.toUpperCase())))
                                .toList(),
                            onChanged: (val) => setState(() => _selectedService = val!),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _basePriceController,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              labelText: "Base Task Price (₹)",
                              filled: true,
                              fillColor: const Color(0xFF1E293B),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                          const SizedBox(height: 24),
                          _buildSectionTitle("Execution Suite"),
                          const SizedBox(height: 12),
                          _buildActionButton(
                            icon: Icons.people_outline,
                            label: "Fetch Workers List",
                            onPressed: () => _runTask("Fetch Workers Directory", () => ApiService.getWorkers()),
                          ),
                          _buildActionButton(
                            icon: Icons.near_me_outlined,
                            label: "Match Nearby Workers",
                            onPressed: () => _runTask(
                              "Worker Matching",
                              () => ApiService.matchWorkers(service: _selectedService, lat: 22.5726, lon: 88.3639),
                            ),
                          ),
                          _buildActionButton(
                            icon: Icons.hourglass_top_outlined,
                            label: "Predict Duration (AI)",
                            onPressed: () => _runTask(
                              "Task Completion Estimation",
                              () => ApiService.predictCompletionTime(workerId: 1, taskType: _selectedService),
                            ),
                          ),
                          _buildActionButton(
                            icon: Icons.show_chart_outlined,
                            label: "Predict Service Demand",
                            onPressed: () => _runTask(
                              "Demand Prediction",
                              () => ApiService.predictDemand(serviceType: _selectedService, region: "north"),
                            ),
                          ),
                          _buildActionButton(
                            icon: Icons.payments_outlined,
                            label: "Calculate Dynamic Price",
                            onPressed: () => _runTask(
                              "Dynamic Price Calculation",
                              () => ApiService.getDynamicPrice(
                                serviceType: _selectedService,
                                basePrice: double.tryParse(_basePriceController.text) ?? 500.0,
                                lat: 22.5726,
                                lon: 88.3639,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(width: 20),

                  // Right Display Output Area
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "Live Stream: $_activeTaskName",
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF38BDF8)),
                              ),
                              if (_isLoading)
                                const SizedBox(
                                  height: 18,
                                  width: 18,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                            ],
                          ),
                          const Divider(height: 24, color: Colors.white10),
                          Expanded(child: _buildOutputDisplay()),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title.toUpperCase(),
      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: Colors.white54),
    );
  }

  Widget _buildActionButton({required IconData icon, required String label, required VoidCallback onPressed}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          icon: Icon(icon, size: 18),
          label: Align(alignment: Alignment.centerLeft, child: Text(label)),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF334155),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
          onPressed: _isLoading ? null : onPressed,
        ),
      ),
    );
  }

  Widget _buildOutputDisplay() {
    if (_isLoading) {
      return const Center(child: Text("Processing request...", style: TextStyle(color: Colors.white54)));
    }

    if (_parsedResult == null) {
      return const Center(
        child: Text("Select an operation from the execution suite to run tests.", style: TextStyle(color: Colors.white38)),
      );
    }

    if (_parsedResult is String) {
      return Center(child: Text(_parsedResult.toString(), style: const TextStyle(color: Colors.redAccent)));
    }

    if (_parsedResult is Map<String, dynamic>) {
      final Map<String, dynamic> data = _parsedResult;
      return ListView(
        children: data.entries
            .map((e) => Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(e.key.replaceAll('_', ' ').toUpperCase(), style: const TextStyle(color: Colors.white70, fontSize: 12)),
                      Text('${e.value}', style: const TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ))
            .toList(),
      );
    }

    if (_parsedResult is List) {
      final List list = _parsedResult;
      if (list.isEmpty) {
        return const Center(child: Text("No data records returned from backend database.", style: TextStyle(color: Colors.white54)));
      }

      return ListView.builder(
        itemCount: list.length,
        itemBuilder: (context, index) {
          final item = list[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.white10),
            ),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: const Color(0xFF6366F1),
                child: Text('${index + 1}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
              title: Text(item['name'] ?? 'Worker #${item['worker_id'] ?? index + 1}',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              subtitle: Text(
                item['service'] != null
                    ? 'Service: ${item['service'].toString().toUpperCase()}   |   Rating: ⭐ ${item['rating'] ?? 5.0}'
                    : 'Distance: ${item['distance_km'] ?? 1.2} km   |   Rating: ⭐ ${item['rating'] ?? 5.0}',
                style: const TextStyle(color: Colors.white54, fontSize: 12),
              ),
            ),
          );
        },
      );
    }

    return SingleChildScrollView(child: Text(_parsedResult.toString()));
  }
}

// Custom Wave Clipper for Top Header
class WaveHeaderClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    Path path = Path();
    path.lineTo(0, size.height - 40);

    var firstControlPoint = Offset(size.width / 4, size.height);
    var firstEndPoint = Offset(size.width / 2, size.height - 30);
    path.quadraticBezierTo(firstControlPoint.dx, firstControlPoint.dy, firstEndPoint.dx, firstEndPoint.dy);

    var secondControlPoint = Offset(size.width - (size.width / 4), size.height - 70);
    var secondEndPoint = Offset(size.width, size.height - 20);
    path.quadraticBezierTo(secondControlPoint.dx, secondControlPoint.dy, secondEndPoint.dx, secondEndPoint.dy);

    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}
