// WeatherMonitor.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Graph from "./Graph";
import "../styles/himrakshak.css";

const WeatherMonitor = () => {
    const [weather, setWeather] = useState({
        temperature: "--",
        humidity: "--",
        pressure: "--",
        altitude: "--"
    });

    const thresholds = {
        temperature: 0,      // Too cold
        humidity: 40,
        pressure: 850,
        altitude: 4000,
    };

    const checkAlert = (key, value) => {
        const val = parseFloat(value);
        return !isNaN(val) && val < thresholds[key];
    };

    const fetchData = async () => {
        try {
            const response = await axios.get("https://api.thingspeak.com/channels/2946951/feeds.json?api_key=KR945FXY0HA1AR0G");
            const data = response.data.feeds[0];

            const newWeather = {
                temperature: data.field1,
                humidity: data.field2,
                pressure: data.field3,
                altitude: data.field4,
            };

            setWeather(newWeather);

            // Save to MongoDB
            for (const field in newWeather) {
                await axios.post("http://localhost:5000/api/sensor/add", {
                    type: "weather",
                    field,
                    value: parseFloat(newWeather[field]),
                });
            }
        } catch (error) {
            console.error("Failed to fetch or store weather data", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card weather-container">
            <h2>🌦️ Weather Monitoring System</h2>
            <div className="weather-cards">
                <div className={`card ${checkAlert("temperature", weather.temperature) ? "alert" : ""}`}>
                    🌡️ Temperature: {weather.temperature} °C
                </div>
                <div className={`card ${checkAlert("humidity", weather.humidity) ? "alert" : ""}`}>
                    💧 Humidity: {weather.humidity} %
                </div>
                <div className={`card ${checkAlert("pressure", weather.pressure) ? "alert" : ""}`}>
                    🔽 Pressure: {weather.pressure} hPa
                </div>
                <div className={`card ${checkAlert("altitude", weather.altitude) ? "alert" : ""}`}>
                    🏔️ Altitude: {weather.altitude} m
                </div>
            </div>
            <div className="graphs">
                <Graph field="temperature" label="Temperature (°C)" color="red" />
                <Graph field="humidity" label="Humidity (%)" color="blue" />
                <Graph field="pressure" label="Pressure (hPa)" color="green" />
                <Graph field="altitude" label="Altitude (m)" color="orange" />
            </div>
        </div>
    );
};

export default WeatherMonitor;
