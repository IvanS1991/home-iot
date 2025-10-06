#include "AnalogAndDigitalSensor.h"

DigitalSensor::DigitalSensor(int pin, char type, String vendor, String model)
  : Sensor(pin, type, vendor, model) {}

void DigitalSensor::init() {
  pinMode(sensorPin, INPUT);
}

int DigitalSensor::getReading(int samples) {
  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += digitalRead(sensorPin);
    delay(5);
  }
  return sum / samples;
}
