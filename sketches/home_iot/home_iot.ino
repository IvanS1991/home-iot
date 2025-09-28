#include "Sensor.h";
#include "SensorRegistry.h";

SensorRegistry sensors = SensorRegistry();

void delaySeconds(int totalDelaySec) {
  for (int i = 0; i < totalDelaySec; ++i) {
    delay(1000); // 1 second at a time
  }
}

void setup() {
  Serial.begin(9600);
  
  analogReference(INTERNAL);
  sensors.addSensor(Sensor(A0, 'L', "Arduino Beginner Kit", "Phototransistor"));
  sensors.addSensor(Sensor(A1, 'T', "Arduino Beginner Kit", "TMP36"));
  sensors.init();
}

void loop() {
  String lines[MAX_SENSORS];
  int count;
  sensors.getOutputLines(lines, count);

  for (int i = 0; i < count; ++i) {
    Serial.println(lines[i]);
  }

  delaySeconds(60);
}
