// TMP36Sensor.h
#ifndef ARDUINO_KIT_PHOTOTRANSISTOR_SENSOR_H
#define ARDUINO_KIT_PHOTOTRANSISTOR_SENSOR_H

#include "AnalogandDigitalSensor.h" // or your combined sensor header

class ArduinoKitPhototransistorSensor : public AnalogSensor {
  public:
    ArduinoKitPhototransistorSensor(int pin)
      : AnalogSensor(pin, 'L', "Arduino Beginner Kit", "Phototransistor") {}
};

#endif