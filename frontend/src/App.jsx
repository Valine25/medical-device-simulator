import React, { useEffect, useState } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {

  const [vitals, setVitals] = useState({
    heart_rate: 0,
    spo2: 0,
    temperature: 0
  });

  const [alert, setAlert] = useState("");
  const [heartHistory, setHeartHistory] = useState([]);

  const fetchVitals = async () => {
    const response = await fetch("http://localhost:5000/api/vitals");
    const data = await response.json();

    setVitals(data);

    setHeartHistory(prev => {
  const pulsePattern = [
    data.heart_rate - 20,
    data.heart_rate - 5,
    data.heart_rate + 30,
    data.heart_rate - 10,
    data.heart_rate
  ];

  const updated = [...prev, ...pulsePattern];

  if (updated.length > 25) {
    updated.splice(0, updated.length - 25);
  }

  return updated;
});

    if (data.anomaly) {
    setAlert("⚠ AI detected abnormal patient vitals");
    } else {
      setAlert("");
    }
  };

  useEffect(() => {
    fetchVitals();
    const interval = setInterval(fetchVitals, 2000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
  labels: heartHistory.map((_, i) => i + 1),
  datasets: [
    {
      label: "Heart Rate",
      data: heartHistory,
      borderColor: "#00ff9c",
      backgroundColor: "rgba(0,255,156,0.2)",
      borderWidth: 3,
      tension: 0.2,
      pointRadius: 0
    }
  ]
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "white"
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: "white"
      },
      grid: {
        color: "rgba(255,255,255,0.1)"
      }
    },
    y: {
      ticks: {
        color: "white"
      },
      grid: {
        color: "rgba(255,255,255,0.1)"
      }
    }
  }
};

  const deviceStatus = vitals.spo2 > 0 ? "Connected" : "Disconnected";

  return (
    <div className="dashboard">

      <h1>Patient Monitoring Dashboard</h1>

      <div className="cards">

        <div className="card">
          <h2>Heart Rate</h2>
          <p>{vitals.heart_rate} bpm</p>
        </div>

        <div className="card">
          <h2>SpO2</h2>
          <p>{vitals.spo2} %</p>
        </div>

        <div className="card">
          <h2>Temperature</h2>
          <p>{vitals.temperature} °C</p>
        </div>

      </div>

      <div className="status">
        Device Status:
        <span className={deviceStatus === "Connected" ? "green" : "red"}>
          {deviceStatus}
        </span>
      </div>

      {alert && <div className="alert">{alert}</div>}

      <div className="chart">
        <Line data={chartData} options={chartOptions} />
      </div>

    </div>
  );
}

export default App;