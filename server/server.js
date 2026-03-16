const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// SQLite connection
const db = new sqlite3.Database("./workouts.db", (err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create table if it doesn't exist
db.run(`
CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_name TEXT,
  num_sets INTEGER,
  reps INTEGER,
  weight REAL,
  date TEXT
)
`);

// Test route
app.get("/", (req, res) => {
  res.send("Workout Tracker API is running");
});

// GET all workouts
app.get("/workouts", (req, res) => {
  const sql = "SELECT * FROM workouts";

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send("Error fetching workouts");
    } else {
      res.json(rows);
    }
  });
});

// POST a new workout
app.post("/workouts", (req, res) => {
  const { exercise_name, num_sets, reps, weight, date } = req.body;

  const sql =
    "INSERT INTO workouts (exercise_name, num_sets, reps, weight, date) VALUES (?, ?, ?, ?, ?)";

  db.run(sql, [exercise_name, num_sets, reps, weight, date], function (err) {
    if (err) {
      res.status(500).send("Error adding workout");
    } else {
      res
        .status(201)
        .json({ message: "Workout added", workoutId: this.lastID });
    }
  });
});

// PUT — Update a workout
app.put("/workouts/:id", (req, res) => {
  const { id } = req.params;
  const { exercise_name, num_sets, reps, weight, date } = req.body;

  const sql =
    "UPDATE workouts SET exercise_name = ?, num_sets = ?, reps = ?, weight = ?, date = ? WHERE id = ?";

  db.run(
    sql,
    [exercise_name, num_sets, reps, weight, date, id],
    function (err) {
      if (err) {
        res.status(500).send("Error updating workout");
      } else if (this.changes === 0) {
        res.status(404).send("Workout not found");
      } else {
        res.json({ message: "Workout updated" });
      }
    }
  );
});

// DELETE a workout
app.delete("/workouts/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM workouts WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).send("Error deleting workout");
    } else if (this.changes === 0) {
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