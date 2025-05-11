//SensorData.js
const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    type: String, // "weather", "movement", "gps"
    field: String, // "temperature", "location", etc.
    value: Number, // optional/dummy for gps
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);