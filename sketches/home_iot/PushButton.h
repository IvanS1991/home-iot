#ifndef PUSH_BUTTON_H
#define PUSH_BUTTON_H

#include <Arduino.h>
#include "AnalogAndDigitalSensor.h"

class PushButton : public DigitalSensor {
  public:
    PushButton(int pin)
      : DigitalSensor(pin, 'F', "Arduino Beginner Kit", "Push Button") {}
};

#endif