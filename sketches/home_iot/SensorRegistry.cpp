#include "SensorRegistry.h"
#include "Sensor.h"

SensorRegistry::SensorRegistry() : sensorCount(0) {}

void SensorRegistry::addSensor(Sensor* sensor) {
  if (sensorCount < MAX_SENSORS) {
    sensors[sensorCount++] = sensor;
  }
}

void SensorRegistry::init() {
  for (int i = 0; i < sensorCount; ++i) {
    sensors[i]->init();
  }
}

void SensorRegistry::getOutputLines(String lines[], int& count) {
  count = sensorCount;
  for (int i = 0; i < sensorCount; ++i) {
    lines[i] = sensors[i]->getOutputLine();
  }
}