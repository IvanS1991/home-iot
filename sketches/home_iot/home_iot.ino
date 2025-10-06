#include "Sensor.h"
#include "TMP36Sensor.h"
#include "ArduinoKitPhototransistorSensor.h"
#include "DS18B20Sensor.h"
#include "SensorRegistry.h"

SensorRegistry sensors = SensorRegistry();

void delaySeconds(int totalDelaySec) {
  for (int i = 0; i < totalDelaySec; ++i) {
    delay(1000); // 1 second at a time
  }
}

void setup() {
  Serial.begin(9600);
  
  sensors.addSensor(new DS18B20Sensor(0));
  sensors.addSensor(new DS18B20Sensor(2));
  sensors.addSensor(new ArduinoKitPhototransistorSensor(27));
  sensors.init();
}

void loop() {
  String lines[MAX_SENSORS];
  int count = 0;
  sensors.getOutputLines(lines, count);

  for (int i = 0; i < count; ++i) {
    Serial.println(lines[i]);
  }

  delaySeconds(60);
}
