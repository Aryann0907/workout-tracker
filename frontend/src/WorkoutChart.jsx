import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const colors = [
  "rgba(75,192,192,1)",
  "rgba(255,99,132,1)",
  "rgba(54,162,235,1)",
  "rgba(255,206,86,1)",
  "rgba(153,102,255,1)",
  "rgba(255,159,64,1)",
];

const WorkoutChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/workouts");
        const workouts = response.data;

        // Group workouts by exercise_name
        const exercises = {};
        workouts.forEach((w) => {
          if (!exercises[w.exercise_name]) exercises[w.exercise_name] = [];
          exercises[w.exercise_name].push(w);
        });

        // Get all unique dates
        const allDates = Array.from(new Set(workouts.map((w) => w.date))).sort();

        // Prepare datasets
        const datasets = Object.keys(exercises).map((exercise, idx) => {
          const data = allDates.map((date) => {
            const workout = exercises[exercise].find((w) => w.date === date);
            return workout ? workout.weight : null;
          });
          return {
            label: exercise,
            data,
            borderColor: colors[idx % colors.length],
            backgroundColor: colors[idx % colors.length].replace("1)", "0.2)"),
            spanGaps: true,
          };
        });

        setChartData({
          labels: allDates,
          datasets,
        });
      } catch (error) {
        console.error("Error fetching workouts for chart:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Workout Progress</h2>
      {chartData.labels ? <Line data={chartData} /> : <p>No data yet.</p>}
    </div>
  );
};

export default WorkoutChart;