// TMP36Sensor.h
#ifndef TMP36_SENSOR_H
#define TMP36_SENSOR_H

#include "AnalogandDigitalSensor.h" // or your combined sensor header

class TMP36Sensor : public AnalogSensor {
  public:
    TMP36Sensor(int pin)
      : AnalogSensor(pin, 'T', "Arduino Beginner Kit", "TMP36") {}
};

#endif