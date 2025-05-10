import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
    const [loading, setLoading] = useState(true);

    const API_KEY = "KR945FXY0HA1AR0G";
    const CHANNEL_ID = "2946951";
    const THINGSPEAK_API = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${API_KEY}`;


    const fetchLocation = async () => {
        try {
            const response = await axios.get(THINGSPEAK_API);
            const data = response.data;
            setLocation({
                latitude: parseFloat(data.field7) || 0,
                longitude: parseFloat(data.field8) || 0,
            });
        } catch (error) {
            console.error("Error fetching location data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
        const interval = setInterval(fetchLocation, 10000);
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

                    {/* Map View */}
                    <div style={{ height: "300px", marginTop: "1rem", borderRadius: "8px", overflow: "hidden" }}>
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
                                <Popup>Soldier’s Last Known Position</Popup>
                            </Marker>
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
