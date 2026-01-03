#ifndef WIFI_STREAM_H
#define WIFI_STREAM_H

#include "CommStream.h"

// Conditional WiFi library include based on platform
#if defined(ARDUINO_RASPBERRY_PI_PICO_W)
  #include <WiFi.h>  // Pico W WiFi (CYW43439)
#elif defined(ARDUINO_ARCH_ESP32) || defined(ARDUINO_ARCH_ESP8266)
  #include <WiFi.h>  // ESP32/ESP8266 WiFi
#else
  #error "WiFiStream only supported on Raspberry Pi Pico W, ESP32, or ESP8266"
#endif

/**
 * WiFi TCP communication stream implementation.
 *
 * Connects to a WiFi network and maintains a persistent TCP connection
 * to a server. Works on Raspberry Pi Pico W and ESP32/ESP8266.
 *
 * Usage:
 *   WiFiStream stream("MySSID", "MyPassword", "192.168.1.100", 8080);
 *   stream.init();  // Connects to WiFi and server
 *   if (stream.available()) {
 *     String line = stream.readLine();
 *   }
 *   stream.writeLine("Hello");
 */
class WiFiStream : public CommStream {
  private:
    const char* ssid;
    const char* password;
    const char* serverHost;
    int serverPort;
    WiFiClient client;
    String readBuffer;

    /**
     * Reconnect to WiFi if disconnected
     */
    void reconnectWiFi() {
      if (WiFi.status() == WL_CONNECTED) {
        return;  // Already connected
      }

      WiFi.disconnect();
      WiFi.begin(ssid, password);

      // Wait for connection with timeout
      int attempts = 0;
      while (WiFi.status() != WL_CONNECTED && attempts < 30) {
        delay(500);
        attempts++;
      }
    }

    /**
     * Reconnect to server if disconnected
     */
    void reconnectServer() {
      if (client.connected()) {
        return;  // Already connected
      }

      client.stop();
      client.connect(serverHost, serverPort);
    }

  public:
    /**
     * Constructor
     * @param ssid WiFi network name
     * @param password WiFi password
     * @param host Server hostname or IP address
     * @param port Server TCP port
     */
    WiFiStream(const char* ssid, const char* password, const char* host, int port)
      : ssid(ssid), password(password), serverHost(host), serverPort(port) {}

    void init() override {
      // Connect to WiFi
      WiFi.begin(ssid, password);

      // Wait for WiFi connection (with timeout)
      int attempts = 0;
      while (WiFi.status() != WL_CONNECTED && attempts < 30) {
        delay(500);
        attempts++;
      }

      if (WiFi.status() != WL_CONNECTED) {
        // WiFi connection failed, but don't hang - continue and retry later
        return;
      }

      // Connect to server
      client.connect(serverHost, serverPort);
    }

    bool available() override {
      // Ensure connections are alive
      reconnectWiFi();
      reconnectServer();

      // Check if we have a complete line in buffer
      if (readBuffer.length() > 0 && readBuffer.indexOf('\n') >= 0) {
        return true;
      }

      // Read from socket into buffer
      while (client.available()) {
        char c = client.read();
        readBuffer += c;
        if (c == '\n') {
          return true;
        }
      }

      return false;
    }

    String readLine() override {
      // Return buffered line if we have one
      int newlineIndex = readBuffer.indexOf('\n');
      if (newlineIndex >= 0) {
        String line = readBuffer.substring(0, newlineIndex);
        readBuffer = readBuffer.substring(newlineIndex + 1);
        line.trim();
        return line;
      }

      return "";
    }

    void writeLine(const String& text) override {
      // Ensure connections are alive
      reconnectWiFi();
      reconnectServer();

      if (client.connected()) {
        client.println(text);
      }
    }

    void flush() override {
      if (client.connected()) {
        client.flush();
      }
    }

    /**
     * Check if WiFi is connected
     * @return true if connected to WiFi network
     */
    bool isWiFiConnected() {
      return WiFi.status() == WL_CONNECTED;
    }

    /**
     * Check if server connection is established
     * @return true if connected to server
     */
    bool isServerConnected() {
      return client.connected();
    }

    /**
     * Get local IP address
     * @return IP address as String, or "0.0.0.0" if not connected
     */
    String getLocalIP() {
      if (WiFi.status() == WL_CONNECTED) {
        return WiFi.localIP().toString();
      }
      return "0.0.0.0";
    }
};

#endif
