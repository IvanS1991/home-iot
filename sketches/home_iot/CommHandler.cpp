#include "SensorRegistry.h"
#include "CommHandler.h"

CommHandler::CommHandler(SensorRegistry& sensorRegistry, LCDScreen& lcdScreen)
  : sensors(sensorRegistry), lcd(lcdScreen) {}

void CommHandler::init(int baud) {
  Serial.begin(baud);
}

void CommHandler::read() {
  if (Serial.available()) {
    String line = Serial.readStringUntil('\n'); // reads until newline
    line.trim();

    String command = getCommand(line);

    if (command == HOME_READING) {
      handleHomeReading(line);
    } else if (command == EDGE_READING) {
      handleEdgeReading(line);
    } else if (command == CLOCK_READING) {
      handleClockReading(line);
    }

    printStatusToLED();
  }
}

void CommHandler::writeLine(String text) {
  Serial.println(text);
}

void CommHandler::writeSensorData() {
  String lines[MAX_SENSORS];
  int count = 0;
  sensors.getOutputLines(lines, count);

  for (int i = 0; i < count; ++i) {
    Serial.println(lines[i]);
  }
}

void CommHandler::delaySec(int totalDelaySec) {
  for (int i = 0; i < totalDelaySec; ++i) {
    delay(1000); // 1 second at a time
  }
}

// private
void CommHandler::writeLCDError(String text) {
  lcd.clear();
  lcd.write("ERROR", 0, 0);
  lcd.write(text, 1, 0);
}

String CommHandler::getCommand(String line) {
  int firstColonIndex = line.indexOf(':');

  if (firstColonIndex < 0) {
    writeLCDError("NO_COMM");
    return "";
  }

  String command = line.substring(0, firstColonIndex);

  if (command != HOME_READING && command != EDGE_READING && command != CLOCK_READING) {
    writeLCDError("UNK_COMM: " + command);
    return "";
  }

  return command;
} 

void CommHandler::handleHomeReading(String line) {
  int firstColonIndex = line.indexOf(':');
  int secondColonIndex = line.indexOf(':', firstColonIndex + 1);
  int thirdColonIndex = line.indexOf(':', secondColonIndex + 1);

  String tempStr = line.substring(firstColonIndex + 1, secondColonIndex);
  String lightStr = line.substring(secondColonIndex + 1, thirdColonIndex);

  temp = tempStr;
  light = lightStr;
}

void CommHandler::handleEdgeReading(String line) {
  int firstColonIndex = line.indexOf(':');
  int secondColonIndex = line.indexOf(':', firstColonIndex + 1);
  int thirdColonIndex = line.indexOf(':', secondColonIndex + 1);

  String cpuStr = line.substring(firstColonIndex + 1, secondColonIndex);
  String memStr = line.substring(secondColonIndex + 1, thirdColonIndex);

  cpu = cpuStr;
  memory = memStr;
}

void CommHandler::handleClockReading(String line) {
  int firstColonIndex = line.indexOf(':');

  String timeStr = line.substring(firstColonIndex + 1);

  time = timeStr;
}

void CommHandler::printStatusToLED() {
  lcd.clear();

  String tempLightText = "T:" + temp + "  L:" + light; // i.e. "T:25.8C L:62.5%"
  lcd.write(tempLightText, 0, 0);
  Serial.println(tempLightText);

  String clockText = "        " + time; // i.e. "        09:12:25"
  lcd.write(clockText, 1, 0);
  Serial.println(clockText);
}