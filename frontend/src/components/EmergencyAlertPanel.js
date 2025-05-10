import React from "react";
import "./../styles/himrakshak.css";

const EmergencyAlertPanel = () => {
    const handleAlertClick = (type) => {
        // Play siren audio
        const siren = new Audio("/alert_siren.mp3");
        siren.play();

        alert(`🚨 ${type} alert sent to Army Central Command!`);
        // Optionally, you can integrate this with backend or messaging systems.
    };

    return (
        <div className="card emergency-panel">
            <h2>🛡️ Emergency Alert Panel</h2>
            <div className="emergency-buttons">
                <button className="btn red" onClick={() => handleAlertClick("Snow Collapse")}>
                    ❄️ Snow Collapse
                </button>
                <button className="btn orange" onClick={() => handleAlertClick("Terrorist Attack")}>
                    💣 Terrorist Attack
                </button>
                <button className="btn yellow" onClick={() => handleAlertClick("War")}>
                    🪖 War
                </button>
                <button className="btn green" onClick={() => handleAlertClick("Rescue Needed")}>
                    🚁 Rescue Needed
                </button>
            </div>
        </div>
    );
};

export default EmergencyAlertPanel;
