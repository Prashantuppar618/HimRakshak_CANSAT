// sensor.js
const express = require("express");
const router = express.Router();
const SensorData = require("../models/SensorData");
const PDFDocument = require("pdfkit");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

router.post("/add", async (req, res) => {
    const { type, field, value, lat, lng, timestamp } = req.body;
    try {
        const data = new SensorData({ type, field, value, lat, lng, timestamp });
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:field/reset", async (req, res) => {
    const { field } = req.params;
    try {
        await SensorData.deleteMany({ field });
        res.status(200).json({ message: `Data for '${field}' has been reset.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:field/latest", async (req, res) => {
    const { field } = req.params;
    const data = await SensorData.find({ field }).sort({ timestamp: -1 }).limit(50);
    res.json(data.reverse());
});

// 📄 PDF REPORT GENERATION
router.get("/report/pdf", async (req, res) => {
    try {
        const fields = await SensorData.distinct("field");
        const width = 800, height = 400;
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
        const doc = new PDFDocument({ margin: 30, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=SensorReport.pdf");
        doc.pipe(res);

        doc.fontSize(20).text("Sensor Report", { align: "center" });
        doc.moveDown(1);

        for (let field of fields) {
            const records = await SensorData.find({ field }).sort({ timestamp: 1 }).limit(50);
            if (records.length === 0) continue;

            const labels = records.map(d => new Date(d.timestamp).toLocaleTimeString());
            const data = records.map(d => d.value);

            const config = {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: field,
                        data,
                        borderColor: "rgba(46,139,87,1)",
                        backgroundColor: "rgba(46,139,87,0.2)",
                        fill: true,
                        tension: 0.4,
                    }],
                },
                options: {
                    responsive: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `${field} Graph`,
                        },
                    },
                },
            };

            const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);
            doc.addPage();
            doc.fontSize(16).text(`Field: ${field}`, { align: "left" });
            doc.image(imageBuffer, { fit: [500, 300], align: "center" });
        }

        doc.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
