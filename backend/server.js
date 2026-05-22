import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import userManagementRoutes from "./routes/userManagementRoutes.js";
import workoutManagementRoutes from "./routes/workoutManagementRoutes.js";
import videoManagementRoutes from "./routes/videoManagementRoutes.js";
import mealManagementRoutes from "./routes/mealManagementRoutes.js";
import mealLogRoutes from "./routes/mealLogRoutes.js";
import adminMealLogRoutes from "./routes/adminMealLogRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import mealGeneratorRoutes from "./routes/mealGeneratorRoutes.js";
import workoutGeneratorRoutes from "./routes/workoutGeneratorRoutes.js";
import { getVideos } from "./controllers/videoController.js";
import { getAllWorkouts, createWorkout, updateWorkout, deleteWorkout } from "./controllers/workoutController.js";
import { initializeMealKnowledgeBase, initializeWorkoutKnowledgeBase } from "./services/ragService.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ── User (mobile app) routes ─────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/logs",  mealLogRoutes);

// ── User workout routes (no auth) ────────────────────────
app.get("/api/workouts",      getAllWorkouts);
app.post("/api/workouts",     createWorkout);
app.put("/api/workouts/:id",  updateWorkout);
app.delete("/api/workouts/:id", deleteWorkout);

// ── Progress tracking routes ──────────────────────────────
app.use("/api/progress", progressRoutes);

// ── AI Generator routes ───────────────────────────────────
app.use("/api/generators/meal", mealGeneratorRoutes);
app.use("/api/generators/workout", workoutGeneratorRoutes);

// ── Public video library route (read-only for mobile app) ─
app.get("/api/videos", getVideos);

// ── Admin routes ─────────────────────────────────────────
app.use("/api/admin/auth",      adminAuthRoutes);
app.use("/api/admin/users",     userManagementRoutes);
app.use("/api/admin/workouts",  workoutManagementRoutes);
app.use("/api/admin/videos",    videoManagementRoutes);
app.use("/api/admin/meals",     mealManagementRoutes);
app.use("/api/admin/meal-logs", adminMealLogRoutes);
app.use("/api/admin/reports",   reportRoutes);

app.get("/", (req, res) => {
  res.send("Server working");
});

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    
    // Initialize knowledge bases
    try {
      await initializeMealKnowledgeBase();
      console.log("Meal knowledge base initialized");
      await initializeWorkoutKnowledgeBase();
      console.log("Workout knowledge base initialized");
    } catch (error) {
      console.warn("Warning: Could not initialize knowledge bases:", error.message);
    }
    
    const port = process.env.PORT || 5050;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.log(err));
