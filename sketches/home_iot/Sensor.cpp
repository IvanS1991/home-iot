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

int Sensor::getReading(int samples = 16) {
  long sum = 0;
  for (int i = 0; i < samples; ++i) {
    sum += analogRead(sensorPin);
    delay(5);
  }
  return sum / (float)samples; // Return raw ADC value
}

String Sensor::getOutputLine() {
  int reading = Sensor::getReading();

  return String(sensorPin) + ":" + String(sensorType) + ":" + sensorVendor + ":" + sensorModel + ":" + String(reading);
}