// Graph.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Graph = ({ field, label, color }) => {
    const [dataPoints, setDataPoints] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/sensor/${field}/latest`
            );
            setDataPoints(response.data);
        } catch (error) {
            console.error("Error fetching graph data", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const chartData = {
        labels: dataPoints.map((d) =>
            new Date(d.timestamp).toLocaleTimeString()
        ),
        datasets: [
            {
                label,
                data: dataPoints.map((d) => d.value),
                fill: false,
                backgroundColor: color,
                borderColor: color,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: label,
            },
        },
    };

    return (
        <div className="card graph-card">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default Graph;
