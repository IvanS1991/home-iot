// Sensor.h
#ifndef Sensor_h
#define Sensor_h

#include <Arduino.h>

class Sensor {
  private:
    int sensorPin;
    char sensorType;
    String sensorVendor;
    String sensorModel;

  public:
    Sensor(); // Default constructor
    Sensor(int pin, char type, String vendor, String model);
    void init();
    int getReading();
    String getOutputLine();
};

#endif