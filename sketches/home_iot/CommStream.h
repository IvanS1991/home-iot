#ifndef COMM_STREAM_H
#define COMM_STREAM_H

#include <Arduino.h>

/**
 * Abstract interface for communication streams.
 *
 * This allows CommHandler to work with any transport layer:
 * - Serial (USB/UART)
 * - WiFi (TCP/HTTP)
 * - Bluetooth
 * - MQTT
 * - Mock (for testing)
 *
 * Implementations must provide:
 * - init(): Initialize the transport (baud rate, WiFi credentials, etc.)
 * - available(): Check if data is ready to read
 * - readLine(): Read a line of text (blocking or non-blocking)
 * - writeLine(): Send a line of text
 * - flush(): Ensure data is sent
 */
class CommStream {
  public:
    virtual ~CommStream() {}

    /**
     * Initialize the communication stream.
     * For Serial: begins at specified baud rate
     * For WiFi: connects to network and server
     * For Bluetooth: pairs and connects
     */
    virtual void init() = 0;

    /**
     * Check if data is available to read.
     * @return true if at least one complete line is ready
     */
    virtual bool available() = 0;

    /**
     * Read a line of text (up to newline character).
     * Should be non-blocking if no data available.
     * @return String containing the line (without newline), or empty string
     */
    virtual String readLine() = 0;

    /**
     * Write a line of text (adds newline automatically).
     * @param text The text to send
     */
    virtual void writeLine(const String& text) = 0;

    /**
     * Flush any buffered data to ensure it's sent immediately.
     * Important for Serial; may be no-op for some transports.
     */
    virtual void flush() = 0;
};

#endif
