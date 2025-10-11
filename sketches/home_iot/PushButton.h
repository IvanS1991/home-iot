#ifndef PUSH_BUTTON_H
#define PUSH_BUTTON_H

#include <Arduino.h>
#include "AnalogAndDigitalSensor.h"

class PushButton : public DigitalSensor {
  private:
    bool switchState = false;
    bool lastButtonState = LOW;
    unsigned long lastDebounceTime = 0;
    const unsigned long debounceDelay = 50; // milliseconds

  public:
    PushButton(int pin)
      : DigitalSensor(pin, 'F', "Arduino Beginner Kit", "Push Button") {}

  void tryToggle() {
    int reading = getReading();

    if (reading != lastButtonState) {
      lastDebounceTime = millis();
    }

    if ((millis() - lastDebounceTime) > debounceDelay) {
      // If the button state has changed:
      if (reading == HIGH && lastButtonState == LOW || reading == LOW && lastButtonState == HIGH) {
        switchState = !switchState; // toggle on/off
      }
    }

    lastButtonState = reading;
  }

  bool isOn() {
    return switchState;
  }
};

#endif