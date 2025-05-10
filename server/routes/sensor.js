const express = require("express");
const router = express.Router();
const SensorData = require("../models/SensorData");

router.post("/add", async (req, res) => {
    const { type, field, value } = req.body;
    try {
        const data = new SensorData({ type, field, value });
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:field/latest", async (req, res) => {
    const { field } = req.params;
    const data = await SensorData.find({ field }).sort({ timestamp: -1 }).limit(50);
    res.json(data.reverse());
});

module.exports = router;
