#ifndef SENSOR_H
#define SENSOR_H

#include <Arduino.h>

// ===== Base Sensor =====
class Sensor {
  protected:
    int sensorPin;
    char sensorType;
    String sensorVendor;
    String sensorModel;

  public:
    Sensor(); // Default constructor
    Sensor(int pin, char type, String vendor, String model);
    virtual ~Sensor() {}

    virtual void init() = 0;
    virtual int getReading(int samples = 16) = 0;
    String getOutputLine();
};

#endif