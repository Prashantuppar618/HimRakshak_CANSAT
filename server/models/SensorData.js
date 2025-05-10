const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    type: String,  // "weather", "movement", etc.
    field: String, // e.g., "temperature", "humidity"
    value: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);
