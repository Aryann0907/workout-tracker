const express = require("express");
const cors = require("cors");  
const mysql = require("mysql2");

const app = express();
app.use(cors());  
app.use(express.json());
const PORT = 3001;

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "workout_tracker"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Workout Tracker API is running");
});

//GET all workouts
app.get("/workouts", (req, res) => {
  const sql = "SELECT * FROM workouts";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Error fetching workouts");
    } else {
      res.json(results);
    }
  });
});


// POST a new workout
app.post("/workouts", (req, res) => {
  const { exercise_name, num_sets, reps, weight, date } = req.body;

  const sql = "INSERT INTO workouts (exercise_name, num_sets, reps, weight, date) VALUES (?, ?, ?, ?, ?)";
  const values = [exercise_name, num_sets, reps, weight, date];

  db.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).send("Error adding workout");
    } else {
      res.status(201).json({ message: "Workout added", workoutId: result.insertId });
    }
  });
});

// PUT — Update a workout
app.put("/workouts/:id", (req, res) => {
  const { id } = req.params;
  const { exercise_name, num_sets, reps, weight, date } = req.body;

  const sql = "UPDATE workouts SET exercise_name = ?, num_sets = ?, reps = ?, weight = ?, date = ? WHERE id = ?";
  const values = [exercise_name, num_sets, reps, weight, date, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).send("Error updating workout");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Workout not found");
    } else {
      res.json({ message: "Workout updated" });
    }
  });
});

// DELETE a workout
app.delete("/workouts/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM workouts WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send("Error deleting workout");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Workout not found");
    } else {
      res.json({ message: "Workout deleted" });
    }
  });
});

// SERVER START
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});