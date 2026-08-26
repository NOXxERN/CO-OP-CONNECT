import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Update IP address if testing on a physical mobile device (e.g., http://192.168.x.x:8000)
  static const String baseUrl = 'http://10.0.2.2:8000';

  /// Helper to extract List data if response is wrapped in a Map key (e.g. {"workers": [...]})
  static dynamic _extractListIfNeeded(dynamic decodedJson, String primaryKey) {
    if (decodedJson is Map<String, dynamic>) {
      if (decodedJson.containsKey(primaryKey)) {
        return decodedJson[primaryKey];
      }
      if (decodedJson.containsKey('data')) {
        return decodedJson['data'];
      }
      if (decodedJson.containsKey('results')) {
        return decodedJson['results'];
      }
    }
    return decodedJson;
  }

  // 1. Fetch Workers List
  static Future<dynamic> getWorkers() async {
    final response = await http.get(Uri.parse('$baseUrl/workers'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return _extractListIfNeeded(data, 'workers');
    } else {
      throw Exception('Failed to load workers (${response.statusCode})');
    }
  }

  // 2. Match Nearby Workers
  static Future<dynamic> matchWorkers({
    required String service,
    required double lat,
    required double lon,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/match-workers'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'service': service,
        'latitude': lat,
        'longitude': lon,
      }),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return _extractListIfNeeded(data, 'matches');
    } else {
      throw Exception('Failed to match workers (${response.statusCode})');
    }
  }

  // 3. Predict Task Completion Duration (AI)
  static Future<dynamic> predictCompletionTime({
    required int workerId,
    required String taskType,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/predict_completion_time'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'worker_id': workerId,
        'task_type': taskType,
      }),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to predict task duration (${response.statusCode})');
    }
  }

  // 4. Predict Service Demand (AI)
  static Future<dynamic> predictDemand({
    required String serviceType,
    required String region,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/predict_demand'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'service_type': serviceType,
        'region': region,
      }),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to predict demand (${response.statusCode})');
    }
  }

  // 5. Calculate Dynamic Price
  static Future<dynamic> getDynamicPrice({
    required String serviceType,
    required double basePrice,
    required double lat,
    required double lon,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/dynamic_price'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'service_type': serviceType,
        'base_price': basePrice,
        'latitude': lat,
        'longitude': lon,
      }),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to calculate dynamic price (${response.statusCode})');
    }
  }
}
