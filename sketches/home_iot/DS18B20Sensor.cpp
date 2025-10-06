#include <OneWire.h>
#include <DallasTemperature.h>
#include "DS18B20Sensor.h"

DS18B20Sensor::DS18B20Sensor(int pin)
  : Sensor(pin, 'T', "Dallas", "DS18B20"), oneWire(pin), dallas(&oneWire) {}

void DS18B20Sensor::init() {
  dallas.begin();
}

int DS18B20Sensor::getReading(int samples) {
  dallas.requestTemperatures();
  return (int)(dallas.getTempCByIndex(0) * 10); // deci-Celsius as raw
}
