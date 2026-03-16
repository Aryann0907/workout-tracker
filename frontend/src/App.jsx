import WorkoutChart from "./WorkoutChart";
import React, { useState } from "react";
import WorkoutForm from "./WorkoutForm";
import WorkoutList from "./WorkoutList";

function App() {
  const [refresh, setRefresh] = useState(false);
  const [editWorkout, setEditWorkout] = useState(null);

  const handleWorkoutAdded = () => {
    setRefresh(!refresh);
  };

  const handleEdit = (workout) => {
    setEditWorkout(workout);
  };

  const clearEdit = () => {
    setEditWorkout(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Workout Tracker</h1>
      <WorkoutForm
        onWorkoutAdded={handleWorkoutAdded}
        editWorkout={editWorkout}
        clearEdit={clearEdit}
      />
      <WorkoutList refresh={refresh} onEdit={handleEdit} />
      <WorkoutChart />
    </div>
  );
}

export default App;