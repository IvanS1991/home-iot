#ifndef DS18B20_SENSOR_H
#define DS18B20_SENSOR_H

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "Sensor.h"

class DS18B20Sensor : public Sensor {
  protected:
    OneWire oneWire;
    DallasTemperature dallas;

  public:
    DS18B20Sensor(int pin);
    void init() override;
    int getReading(int samples = 16) override;
};

#endif