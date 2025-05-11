import React from "react";

const ReportDownload = () => {
    const downloadReport = () => {
        fetch("http://localhost:5000/api/sensor/report/pdf")
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "Sensor_Report.pdf";
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
    };

    return (
        <div className="report-download">
            <button onClick={downloadReport}>📄 Generate Report</button>
        </div>
    );
};

export default ReportDownload;
