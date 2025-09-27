#include "Sensor.h"

Sensor::Sensor() {}

Sensor::Sensor(int pin, char type, String vendor, String model) {
  sensorPin = pin;
  sensorType = type;
  sensorVendor = vendor;
  sensorModel = model;
}

void Sensor::init() {
  pinMode(sensorPin, INPUT);
}

int Sensor::getReading() {
  return analogRead(sensorPin);
}

String Sensor::getOutputLine() {
  int reading = Sensor::getReading();

  return String(sensorPin) + ":" + String(sensorType) + ":" + sensorVendor + ":" + sensorModel + ":" + String(reading);
}