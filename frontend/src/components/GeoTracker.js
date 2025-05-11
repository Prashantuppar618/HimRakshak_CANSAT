// ✅ GeoTracker.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fixing the default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const GeoTracker = () => {
    const [location, setLocation] = useState(null);
    const [path, setPath] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_KEY = "KR945FXY0HA1AR0G";
    const CHANNEL_ID = "2946951";
    const THINGSPEAK_API = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${API_KEY}`;

    const fetchLocation = async () => {
        try {
            const response = await axios.get(THINGSPEAK_API);
            const data = response.data;
            const lat = parseFloat(data.field7);
            const lng = parseFloat(data.field8);
            const timestamp = data.created_at;

            if (!isNaN(lat) && !isNaN(lng)) {
                const newLocation = { latitude: lat, longitude: lng };
                setLocation(newLocation);
                setPath(prev => [...prev, [lat, lng]]);

                // Save to MongoDB
                await axios.post("http://localhost:5000/api/sensor/add", {
                    type: "gps",
                    field: "location",
                    value: 0, // Placeholder; you may remove this
                    lat,
                    lng,
                    timestamp
                });
            }
        } catch (error) {
            console.error("Error fetching or saving location data:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearPath = () => {
        setPath([]);
    };

    useEffect(() => {
        fetchLocation();
        const interval = setInterval(fetchLocation, 10000); // Fetch every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card geo-card">
            <h2>📍 Soldier Location Tracker</h2>
            {loading ? (
                <p>Loading location data...</p>
            ) : location ? (
                <>
                    <div className="data-block">
                        <p>📌 Latitude: {location.latitude}</p>
                        <p>📌 Longitude: {location.longitude}</p>
                    </div>

                    <button onClick={clearPath} style={{ marginBottom: "10px" }}>
                        🗑️ Clear Path
                    </button>

                    <div className="map-container">
                        <MapContainer
                            center={[location.latitude, location.longitude]}
                            zoom={15}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <Marker position={[location.latitude, location.longitude]}>
                                <Popup>🧭 Last Known Position</Popup>
                            </Marker>
                            <Polyline positions={path} color="blue" />
                        </MapContainer>
                    </div>
                </>
            ) : (
                <p>Location data not available.</p>
            )}
        </div>
    );
};

export default GeoTracker;
