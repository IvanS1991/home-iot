-- /etc/schema.sql

CREATE TABLE sensors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL
);

CREATE TABLE readings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  sensor_id INT NOT NULL,
  value FLOAT NOT NULL,
  FOREIGN KEY (sensor_id) REFERENCES sensors(id)
);
