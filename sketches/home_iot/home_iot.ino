#include "Sensor.h"
#include "TMP36Sensor.h"
#include "ArduinoKitPhototransistorSensor.h"
#include "DS18B20Sensor.h"
#include "SensorRegistry.h"
#include "LCDScreen.h"
#include "CommHandler.h"

SensorRegistry sensors = SensorRegistry();
LCDScreen lcdScreen(13, 12, 3, 2, 7, 6);
CommHandler commHandler(sensors, lcdScreen);

void setup() {
  sensors.addSensor(new ArduinoKitPhototransistorSensor(26));
  sensors.addSensor(new TMP36Sensor(28));
  sensors.init();
  lcdScreen.init();
  commHandler.init(9600);
}

void loop() {
  commHandler.read();
  commHandler.writeSensorData();
  commHandler.delaySec(1);
}
