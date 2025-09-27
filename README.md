# Home IoT Sensor Logger

This project is a complete home IoT solution for collecting, logging, and visualizing sensor data (such as light and temperature) using Arduino and a Node.js/TypeScript backend with MariaDB.

## Features
- Arduino sketch for reading multiple sensors and sending data over serial
- Modular sensor and registry classes for easy extension
- Node.js/TypeScript backend server using Express
- Serial reader script to collect sensor data from Arduino and post to backend
- MariaDB database for persistent storage
- TypeORM for automatic schema management
- Configurable via JSON config files

## Project Structure
```
arduino/
├── sketches/home_iot/         # Arduino code (Sensor, SensorRegistry, main sketch)
├── serial-reader/             # Node.js serial reader script
├── home-iot-server/           # Express backend server
│   ├── data/models/           # TypeORM models
│   ├── db.ts                  # Database connection and helpers
│   ├── server.ts              # Express server entry point
├── shared/                    # Shared helpers and types
├── etc/                       # Example config files
```

## How It Works
1. **Arduino** reads sensor values and outputs lines over serial in the format:
   ```
   pin:type:vendor:model:value
   ```
2. **Serial Reader** (Node.js) reads serial data, parses it, and sends HTTP POST requests to the backend server.
3. **Backend Server** receives readings and stores them in MariaDB using TypeORM.
4. **Database** stores all readings with timestamp, pin, vendor, model, type, and value.

## Getting Started

### Prerequisites
- Arduino board (e.g., Uno, Nano)
- Node.js (v18+ recommended)
- MariaDB server

### Arduino Setup
1. Open `sketches/home_iot/home_iot.ino` in Arduino IDE.
2. Upload to your board.
3. Connect the board to your computer via USB.

### Backend Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Configure your database and serial port in `etc/conf.json` (see `conf.example.json`).
3. Start the backend server:
   ```
   npm run iot-server
   ```
4. Start the serial reader (replace `<port>` with your Arduino COM port):
   ```
   npm run serial-reader -- <port>
   ```

### Database
- The schema is managed automatically by TypeORM.
- All sensor readings are stored in the `readings` table.

## Extending
- Add new sensors in `home_iot.ino` using `sensors.addSensor(...)`.
- Extend the `Sensor` class for new sensor types.
- Add new endpoints or analytics in the backend as needed.

## License
MIT

## Author
ivans1991
