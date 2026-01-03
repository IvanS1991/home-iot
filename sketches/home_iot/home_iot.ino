#include "Config.h"
#include "Sensor.h"
#include "TMP36Sensor.h"
#include "ArduinoKitPhototransistorSensor.h"
#include "DS18B20Sensor.h"
#include "SensorRegistry.h"
#include "LCDScreen.h"
#include "CommHandler.h"
#include "PushButton.h"
#include "SerialStream.h"
#include "WiFiStream.h"

SensorRegistry sensors = SensorRegistry();
LCDScreen lcdScreen(LCD_RS, LCD_EN, LCD_D4, LCD_D5, LCD_D6, LCD_D7);
PushButton commButton(16);

#if defined(USE_WIFI)
  WiFiStream commStream(WIFI_SSID, WIFI_PASS, TCP_HOST, TCP_PORT); // Wireless comms
#else
  SerialStream commStream(BAUD_RATE);  // Serial communication at 9600 baud
#endif

SerialStream serialStream(BAUD_RATE);  // Serial communication at 9600 baud
CommHandler commHandler(sensors, lcdScreen, commButton, &commStream);

void setup() {
  sensors.addSensor(new ArduinoKitPhototransistorSensor(26));
  sensors.addSensor(new TMP36Sensor(28));
  sensors.init();
  lcdScreen.init();
  commHandler.init();
}

void loop() {
  commHandler.read();
  commHandler.writeSensorData();
}
