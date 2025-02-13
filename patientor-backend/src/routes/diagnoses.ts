import express, { Response } from "express";
import diagnosisService from "../services/diagnosisService";
import { Diagnosis } from "../types";

export const diagnosesRouter = express.Router();

diagnosesRouter.get("/", (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosisService.getDiagnoses());
});
