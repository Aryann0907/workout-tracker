const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// SQLite database
const db = new Database("workouts.db");

// Create table if it doesn't exist
db.prepare(`
CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_name TEXT,
    num_sets INTEGER,
    reps INTEGER,
    weight INTEGER,
    date TEXT
)
`).run();

console.log("Connected to SQLite database");

// Test route
app.get("/", (req, res) => {
  res.send("Workout Tracker API is running");
});

// GET all workouts
app.get("/workouts", (req, res) => {
  try {
    const workouts = db.prepare("SELECT * FROM workouts").all();
    res.json(workouts);
  } catch (error) {
    res.status(500).send("Error fetching workouts");
  }
});

// POST workout
app.post("/workouts", (req, res) => {
  const { exercise_name, num_sets, reps, weight, date } = req.body;

  try {
    const stmt = db.prepare(
      "INSERT INTO workouts (exercise_name, num_sets, reps, weight, date) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(exercise_name, num_sets, reps, weight, date);

    res.status(201).json({
      message: "Workout added",
      workoutId: result.lastInsertRowid,
    });
  } catch (error) {
    res.status(500).send("Error adding workout");
  }
});

// UPDATE workout
app.put("/workouts/:id", (req, res) => {
  const { id } = req.params;
  const { exercise_name, num_sets, reps, weight, date } = req.body;

  try {
    const stmt = db.prepare(
      "UPDATE workouts SET exercise_name=?, num_sets=?, reps=?, weight=?, date=? WHERE id=?"
    );

    const result = stmt.run(
      exercise_name,
      num_sets,
      reps,
      weight,
      date,
      id
    );

    if (result.changes === 0) {
      return res.status(404).send("Workout not found");
    }

    res.json({ message: "Workout updated" });
  } catch (error) {
    res.status(500).send("Error updating workout");
  }
});

// DELETE workout
app.delete("/workouts/:id", (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare("DELETE FROM workouts WHERE id=?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).send("Workout not found");
    }

    res.json({ message: "Workout deleted" });
  } catch (error) {
    res.status(500).send("Error deleting workout");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});