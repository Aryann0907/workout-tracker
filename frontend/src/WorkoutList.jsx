import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://workout-tracker-3.onrender.com";

const WorkoutList = ({ refresh, onEdit }) => {
  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`${API_URL}/workouts`);
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/workouts/${id}`);
      fetchWorkouts();
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  return (
    <div>
      <h2>Workout History</h2>

      {workouts.length === 0 ? (
        <p>No workouts yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Weight (kg)</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {workouts.map((w) => (
              <tr key={w.id}>
                <td>{w.exercise_name}</td>
                <td>{w.num_sets}</td>
                <td>{w.reps}</td>
                <td>{w.weight}</td>
                <td>{w.date}</td>
                <td>
                  <button onClick={() => onEdit(w)}>Edit</button>
                  <button onClick={() => handleDelete(w.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WorkoutList;