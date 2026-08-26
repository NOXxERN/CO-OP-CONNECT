// This is a basic Flutter widget test.

import 'package:flutter_test/flutter_test.dart';
import 'package:coop_connect_app/main.dart';

void main() {
  testWidgets('CO-OP CONNECT dashboard smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const CoOpConnectApp());

    // Verify that the main title exists
    expect(find.text('CO-OP CONNECT'), findsOneWidget);
  });
}
