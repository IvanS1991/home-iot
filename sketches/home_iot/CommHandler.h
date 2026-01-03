#ifndef COMM_HANDLER_H
#define COMM_HANDLER_H

#include <Arduino.h>
#include "SensorRegistry.h"
#include "LCDScreen.h"
#include "PushButton.h"
#include "CommStream.h"

#define HOME_READING "Home"
#define EDGE_READING "Edge"
#define CLOCK_READING "Clock"

class CommHandler {
  private:
    SensorRegistry& sensors;
    LCDScreen& lcd;
    PushButton& pushButton;
    CommStream* stream;  // Abstract communication stream
    String temp;
    String light;
    String cpu;
    String memory;
    String time;
    String topLcdText;
    String bottomLcdText;
    int lastDataSentTimestamp;

    String getCommand(String line);
    void writeLCDError(String text);
    void handleHomeReading(String line);
    void handleEdgeReading(String line);
    void handleClockReading(String line);
    void printStatusToLED();

  public:
    CommHandler(); // Default constructor
    CommHandler(SensorRegistry& sensorRegistry, LCDScreen& lcdScreen, PushButton& commButton, CommStream* commStream);

    void init();
    void read();
    void writeLine(String text);
    void writeSensorData();
    void delaySec(int totalDelaySec);
};

#endif