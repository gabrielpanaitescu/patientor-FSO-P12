import express from "express";
import cors from "cors";
import "express-async-errors";
import { diagnosesRouter } from "./routes/diagnoses";
import { patientsRouter } from "./routes/patients";
import { statisticsRouter } from "./routes/statistics";

import { errorMiddleware, unknownEndpoint } from "./utils/middleware";

import connectToMongo from "../mongo";
connectToMongo();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

let visits = 0;
app.get("/api/", (_req, res) => {
  visits++;
  res.status(200).json({
    visits,
  });
});

app.get("/api/ping", (_req, res) => {
  console.log("Received ping");
  res.send("pong!");
});

app.use("/api/statistics", statisticsRouter);
app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);

app.use(unknownEndpoint);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
