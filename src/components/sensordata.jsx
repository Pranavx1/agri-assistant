// src/components/SensorDataViewer.js
"use client";
import { useSensorData } from '../hooks/sensorData'; // Adjust path if needed

export function SensorDataViewer() {
  const { sensorData, loading } = useSensorData();

  if (loading) {
    return <p>Loading sensor data...</p>;
  }

  if (!sensorData) {
    return <p>No sensor data found.</p>;
  }

  return (
    <div>
      <h2>Live Sensor Readings</h2>
      <p>Temperature: {sensorData.dht?.temperature}°C</p>
      <p>Humidity: {sensorData.dht?.humidity}%</p>
    </div>
  );
}