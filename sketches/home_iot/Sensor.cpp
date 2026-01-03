#include "Sensor.h"
#include "Config.h"

Sensor::Sensor() {}

Sensor::Sensor(int pin, char type, String vendor, String model) {
  sensorPin = pin;
  sensorType = type;
  sensorVendor = vendor;
  sensorModel = model;
}

// Do NOT implement pure virtuals here

String Sensor::getOutputLine() {
  int reading = getReading();
  return String(BOARD_VREF) + ":" + String(BOARD_ADC_MAX) + ":" + String(sensorPin) + ":" + sensorType + ":" + sensorVendor + ":" + sensorModel + ":" + String(reading);
}