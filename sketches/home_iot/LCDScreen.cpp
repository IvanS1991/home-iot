#include "LCDScreen.h"

LCDScreen::LCDScreen(int rs, int en, int d4, int d5, int d6, int d7)
  : lcd(rs, en, d4, d5, d6, d7) {}

void LCDScreen::init() {
  lcd.begin(cols, rows);
}

void LCDScreen::write(String text, int rowPos, int colPos) {
  lcd.setCursor(colPos, rowPos);
  lcd.print(text);
}

void LCDScreen::clear() {
  lcd.setCursor(0,0);
  lcd.print("                ");  // 16 spaces for first row
  lcd.setCursor(0,1);
  lcd.print("                ");  // 16 spaces for second row
}