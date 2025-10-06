#include "AnalogAndDigitalSensor.h"

AnalogSensor::AnalogSensor(int pin, char type, String vendor, String model)
  : Sensor(pin, type, vendor, model) {}

void AnalogSensor::init() {
  pinMode(sensorPin, INPUT);
}

int AnalogSensor::getReading(int samples) {
  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(sensorPin);
    delay(5);
  }
  return sum / samples;
}
