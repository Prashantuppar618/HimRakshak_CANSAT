import React, { useState } from "react";
import WeatherMonitor from "./components/WeatherMonitor";
import GeoTracker from "./components/GeoTracker";
import MovementAlert from "./components/MovementAlert";
import EmergencyAlertPanel from "./components/EmergencyAlertPanel";
import ReportDownload from "./components/ReportDownload"; // <-- NEW
import "./styles/himrakshak.css";
import 'leaflet/dist/leaflet.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "pappu") {
      setAuthenticated(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  if (!authenticated) {
    return (
      <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>HIMRAKSHAK LOGIN</h2>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="himrakshak-dashboard">
      <h1 className="title">🛡️ HIMRAKSHAK ARMY MONITORING SYSTEM 🏔️</h1>
      <ReportDownload /> {/* ⬅️ Added here */}
      <div className="grid-container">
        <WeatherMonitor />
        <GeoTracker />
        <MovementAlert />
        <EmergencyAlertPanel />
      </div>
    </div>
  );
}

export default App;
