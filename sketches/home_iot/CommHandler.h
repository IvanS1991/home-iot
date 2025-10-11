#ifndef COMM_HANDLER_H
#define COMM_HANDLER_H

#include <Arduino.h>
#include "SensorRegistry.h"
#include "LCDScreen.h"
#include "PushButton.h"

#define HOME_READING "Home"
#define EDGE_READING "Edge"
#define CLOCK_READING "Clock"

class CommHandler {
  private:
    SensorRegistry& sensors;
    LCDScreen& lcd;
    PushButton& pushButton;
    String temp;
    String light;
    String cpu;
    String memory;
    String time;
    String topLcdText;
    String bottomLcdText;

    String getCommand(String line);
    void writeLCDError(String text);
    void handleHomeReading(String line);
    void handleEdgeReading(String line);
    void handleClockReading(String line);
    void printStatusToLED();

  public:
    CommHandler(); // Default constructor
    CommHandler(SensorRegistry& sensorRegistry, LCDScreen& lcdScreen, PushButton& commButton); // Default constructor

    void init(int baud);
    void read();
    void writeLine(String text);
    void writeSensorData();
    void delaySec(int totalDelaySec);
};

#endif