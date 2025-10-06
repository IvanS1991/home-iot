// Sensor.h
#ifndef SensorRegistry_h
#define SensorRegistry_h

#include <Arduino.h>
#include "Sensor.h"

#define MAX_SENSORS 10

class SensorRegistry {
  private:
    Sensor* sensors[MAX_SENSORS];
    int sensorCount;

  public:
    SensorRegistry();
    void addSensor(Sensor* sensor);
    void init();
    void getOutputLines(String lines[], int& count);
};

#endif