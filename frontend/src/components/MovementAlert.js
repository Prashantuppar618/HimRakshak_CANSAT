// MovementAlert.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Graph from "./Graph"; // Import the Graph component

const MovementAlert = () => {
    const [movement, setMovement] = useState({ accelX: 0, gyroX: 0 });
    const [alert, setAlert] = useState(false);

    const THINGSPEAK_API =
        "https://api.thingspeak.com/channels/2946951/feeds/last.json?api_key=KR945FXY0HA1AR0G";

    const fetchMovement = async () => {
        try {
            const response = await axios.get(THINGSPEAK_API);
            const data = response.data;
            const accel = parseFloat(data.field5);
            const gyro = parseFloat(data.field6);

            setMovement({ accelX: accel, gyroX: gyro });

            // Thresholds based on field understanding — tweak as needed
            if (Math.abs(accel) > 10 || Math.abs(gyro) > 300) {
                setAlert(true);
            } else {
                setAlert(false);
            }

            // Save to MongoDB
            await axios.post("http://localhost:5000/api/sensor/add", {
                type: "movement",
                field: "accelX",
                value: accel,
            });
            await axios.post("http://localhost:5000/api/sensor/add", {
                type: "movement",
                field: "gyroX",
                value: gyro,
            });
        } catch (error) {
            console.error("Error fetching movement data:", error);
        }
    };

    useEffect(() => {
        fetchMovement();
        const interval = setInterval(fetchMovement, 10000); // every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`card movement-card ${alert ? "alert" : ""}`}>
            <h2>📈 Movement Alert</h2>
            <div className="data-block">
                <p>Accel X: {movement.accelX} m/s²</p>
                <p>Gyro X: {movement.gyroX} °/s</p>
            </div>
            {alert && (
                <div className="alert-message">
                    🚨 Unusual movement detected! Possible landslide, attack, or collapse.
                </div>
            )}
            <div className="graphs">
                <Graph field="accelX" label="Accel X (m/s²)" color="purple" />
                <Graph field="gyroX" label="Gyro X (°/s)" color="teal" />
            </div>
        </div>
    );
};

export default MovementAlert;
