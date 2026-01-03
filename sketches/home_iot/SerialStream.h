#ifndef SERIAL_STREAM_H
#define SERIAL_STREAM_H

#include "CommStream.h"

/**
 * Serial communication stream implementation.
 *
 * Uses Arduino's built-in Serial object for USB/UART communication.
 * Works on all Arduino-compatible boards (Arduino Uno, Nano, Pico, Pico W, ESP32, etc.)
 *
 * Usage:
 *   SerialStream stream(9600);
 *   stream.init();
 *   if (stream.available()) {
 *     String line = stream.readLine();
 *   }
 *   stream.writeLine("Hello");
 */
class SerialStream : public CommStream {
  private:
    int baudRate;

  public:
    /**
     * Constructor
     * @param baud Baud rate (e.g., 9600, 115200)
     */
    SerialStream(int baud) : baudRate(baud) {}

    void init() override {
      Serial.begin(baudRate);

      // Wait for serial port to connect (needed for native USB boards like Leonardo, Pico)
      // Timeout after 2 seconds to avoid hanging if USB is not connected
      unsigned long startTime = millis();
      while (!Serial && (millis() - startTime < 2000)) {
        ; // Wait for serial port
      }
    }

    bool available() override {
      return Serial.available() > 0;
    }

    String readLine() override {
      if (!Serial.available()) {
        return "";
      }

      String line = Serial.readStringUntil('\n');
      line.trim();  // Remove whitespace and newline characters
      return line;
    }

    void writeLine(const String& text) override {
      Serial.println(text);
    }

    void flush() override {
      Serial.flush();
    }
};

#endif
