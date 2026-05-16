import express from "express";
import cors from "cors";
import { getPriorityNotifications } from "./priorityNotifications";
import { Log } from "../../logging_middleware/src/logger";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running"
  });
});

app.get("/priority-notifications", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    if (limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Limit must be a positive number"
      });
    }

    await Log(
      "backend",
      "info",
      "route",
      "priority notifications endpoint called"
    );

    const data = await getPriorityNotifications(limit);

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    await Log(
      "backend",
      "error",
      "route",
      "failed to return priority notifications"
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get priority notifications"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});