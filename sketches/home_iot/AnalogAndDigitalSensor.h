#ifndef ANALOG_AND_DIGITAL_SENSOR_H
#define ANALOG_AND_DIGITAL_SENSOR_H

#include <Arduino.h>
#include "Sensor.h"

#define ANALOG_VREF_INTERNAL 1.1
#define ANALOG_VREF 3.3

class AnalogSensor : public Sensor {
  public:
    AnalogSensor(int pin, char type, String vendor, String model);
    void init() override;
    int getReading(int samples = 16) override;
};

class DigitalSensor : public Sensor {
  public:
    DigitalSensor(int pin, char type, String vendor, String model);
    void init() override;
    int getReading(int samples = 16) override;
};

#endif