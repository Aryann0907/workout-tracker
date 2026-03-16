import React, { useState, useEffect } from "react";
import axios from "axios";

const WorkoutForm = ({ onWorkoutAdded, editWorkout, clearEdit }) => {
  const [exercise_name, setExerciseName] = useState("");
  const [num_sets, setNumSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");

  const API_URL = "https://workout-tracker-3.onrender.com";

  useEffect(() => {
    if (editWorkout) {
      setExerciseName(editWorkout.exercise_name);
      setNumSets(editWorkout.num_sets);
      setReps(editWorkout.reps);
      setWeight(editWorkout.weight);
      setDate(editWorkout.date);
    }
  }, [editWorkout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editWorkout) {
        await axios.put(`${API_URL}/workouts/${editWorkout.id}`, {
          exercise_name,
          num_sets: parseInt(num_sets),
          reps: parseInt(reps),
          weight: parseFloat(weight),
          date,
        });

        alert("Workout updated!");
        clearEdit();

      } else {
        await axios.post(`${API_URL}/workouts`, {
          exercise_name,
          num_sets: parseInt(num_sets),
          reps: parseInt(reps),
          weight: parseFloat(weight),
          date,
        });

        alert("Workout added!");
      }

      onWorkoutAdded();

      setExerciseName("");
      setNumSets("");
      setReps("");
      setWeight("");
      setDate("");

    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Exercise Name"
        value={exercise_name}
        onChange={(e) => setExerciseName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Sets"
        value={num_sets}
        onChange={(e) => setNumSets(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">
        {editWorkout ? "Update Workout" : "Add Workout"}
      </button>
    </form>
  );
};

export default WorkoutForm;