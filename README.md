
---

```markdown
# 🛰️ HimRakshak – Border Surveillance CanSAT System

**Project HimRakshak** is a rugged, modular, and autonomous monitoring system designed for the **Indian Border Security Forces**, deployed via a CanSAT (Can-sized Satellite) prototype. It continuously monitors environmental conditions, tracks location, detects motion anomalies, and displays real-time sensor data on a full-stack web application.

---

## 🔧 System Overview

- **Frontend**: ReactJS (Real-time graphs, alert UI, tracking interface)
- **Backend**: Node.js + Express + MongoDB Atlas (stores & serves sensor data)
- **Communication**: ESP32 microcontroller → ThingSpeak API → Server DB
- **Database**: MongoDB Atlas with Mongoose ORM

---

## 🧠 CanSAT Hardware Architecture

**Sensors Used:**
- 🌡️ DHT22 – Temperature & Humidity
- ⛰️ BMP280 – Pressure & Altitude
- 🌀 MPU6050 – Acceleration & Gyroscope
- 📍 NEO-6M GPS – Latitude/Longitude Tracking

**Embedded Code (ESP32 in C++):**
- Collects sensor data every second
- Sends readings to ThingSpeak every 20 seconds
- Handles connection retries and GPS decoding

> ✅ Refer to `sendToThingSpeak()` in the ESP32 code for data payload formatting.

---

## 🌐 Features

### ✅ Real-time Dashboard (ReactJS)
- Environmental readings: temperature, humidity, pressure, altitude
- Movement alerts with anomaly detection (e.g., landslides)
- Soldier GPS tracking on OpenStreetMap
- Auto-refreshing graphs for all metrics

### 🧠 Smart Alerts
- Movement spikes over thresholds trigger warnings
- Sudden pressure drops = avalanche or altitude hazard

### 🗃️ Graphing and Storage
- Sensor data stored in MongoDB Atlas
- Charts updated every 10 seconds
- Reset individual sensor graphs
- Generate PDF report with all graphs (One-click export)

---

## 📦 Setup Instructions

### 🔌 1. Clone & Install

```bash
git clone https://github.com/your-username/himrakshak.git
cd himrakshak
npm install
cd frontend
npm install
````

### 🛠️ 2. Environment Setup

Create `.env` in `/backend`:

```env
MONGO_URI=your_mongo_connection_string
```

### 🚀 3. Start Development

```bash
# Backend
cd backend
node server.js

# Frontend
cd frontend
npm start
```

---

## 🛰️ Deployment Flow

1. **Sensor Integration** (ESP32 C++) — Reads sensors and transmits to ThingSpeak
2. **Backend Collection** — Node.js server polls ThingSpeak and stores in MongoDB
3. **Frontend Dashboard** — React renders real-time data + maps + alerts

---

## 🧪 Simulations & Testing

* ESP32 simulation mode increases altitude/pressure every second
* MPU6050 simulates varying acceleration and gyroscope values
* GeoTracker displays a static location but logs real-time tracks if live GPS data is received

---

## 📊 PDF Report Generation

* Generates visual reports of graphs only
* Exported as `.pdf` from the dashboard
* Useful for mission logs and archival

---

## 🌄 Mission Goals (as per [CanSAT PDR](./docs/CANSAT_Design_documentation_SkyLinkers.docx))

* ❄️ Survive -20°C to 50°C environments
* 📡 Transmit live data in harsh terrain
* 💥 Cushion descent via balloon casing
* 📍 Track location post-deployment
* 📉 Detect landslides and collapses in real-time

---

## 🛡️ Ethical & Environmental Impact

* No offensive functionality
* Made with lightweight and biodegradable materials
* Designed for rescue, border patrol, and civilian safety

---

## 🧑‍💻 Team SkyLinkers

A group of passionate engineers building smart tech for secure borders.

---

## 📃 License

MIT License – Free to use with attribution.

---

### 🧠 Acknowledgment

Thanks to [ThingSpeak](https://thingspeak.com), [Leaflet.js](https://leafletjs.com), [Chart.js](https://www.chartjs.org), and [ESP32 community](https://docs.espressif.com) for their incredible tools and support.

```

---

Let me know if you want a version with markdown images/diagrams, or want the README translated to Hindi for local audiences.
```
