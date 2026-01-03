#pragma once

// Board detection and VREF configuration
#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
  // Pico W - WiFi enabled
  #define PI_PICO_W
  #define BOARD_VREF 3.3
  #define BOARD_ADC_MAX 1023
  #define BOARD_MODEL "Raspberry Pi Pico W"
#elif defined(ARDUINO_RASPBERRY_PI_PICO)
  // Pico (non-W) - No WiFi
  #define PI_PICO
  #define BOARD_VREF 3.3
  #define BOARD_ADC_MAX 1023
  #define BOARD_MODEL "Raspberry Pi Pico"
#elif defined(ARDUINO_AVR_UNO) || defined(ARDUINO_AVR_NANO)
  // Arduino Uno/Nano (REV3)
  #define UNO_REV3
  #define BOARD_VREF 1.1  // Using internal 1.1V reference
  #define BOARD_ADC_MAX 1023
  #define BOARD_VENDOR "Arduino"
  #define BOARD_MODEL "Arduino Uno Rev3"
#else
  #error "Unsupported board type - please add board detection"
#endif

// Common configurations
#if defined(PI_PICO_W) || defined(PI_PICO)
  #define BAUD_RATE 115200
#elif defined(UNO_REV3)
  #define BAUD_RATE 9600
#endif

#if defined(PI_PICO_W)
  #define USE_WIFI
#endif

#if defined(USE_WIFI)
  #define WIFI_SSID "SSID_Name"
  #define WIFI_PASS "Password"
  #define TCP_HOST "Host_Address"
  #define TCP_PORT 1111
#endif

#define LCD_RS 13
#define LCD_EN 12
#define LCD_D4 3
#define LCD_D5 2
#define LCD_D6 7
#define LCD_D7 6

#define DATA_EMIT_DELAY 60000