#include "Sensor.h";
#include "SensorRegistry.h";

SensorRegistry sensors = SensorRegistry();

void debugBlink() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  
  sensors.addSensor(Sensor(A0, 'L', "Arduino Beginner Kit", "Phototransistor"));
  sensors.init();
}

void loop() {
  String lines[MAX_SENSORS];
  int count;
  sensors.getOutputLines(lines, count);

  for (int i = 0; i < count; ++i) {
    Serial.println(lines[i]);
  }

  debugBlink();
}
