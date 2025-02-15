import getRedisClient from "../../redis";
import express from "express";

export const statisticsRouter = express.Router();

statisticsRouter.use("/", async (_req, res) => {
  const redisClient = await getRedisClient();

  let addedPatientsCount;
  addedPatientsCount = await redisClient.get("addedPatients");
  if (addedPatientsCount === null || addedPatientsCount === undefined) {
    addedPatientsCount = "No data registered yet. Add new patients to begin";
  }

  res.status(200).json({ addedPatients: addedPatientsCount });
});
