#ifndef LCD_SCREEN_H
#define LCD_SCREEN_H

#include <Arduino.h>
#include <LiquidCrystal.h>

class LCDScreen {
  private:
    int cols = 16;
    int rows = 2;
    LiquidCrystal lcd;

  public:
    LCDScreen(); // Default constructor
    LCDScreen(int rs, int en, int d4, int d5, int d6, int d7);

    void init();
    void write(String text, int rowPos, int colPos);
    void clear();
};

#endif