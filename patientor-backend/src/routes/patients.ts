import express, { NextFunction, Request, Response } from "express";
import patientService from "../services/patientService";
import {
  BaseEntry,
  Entry,
  IdlessEntry,
  ParsedPatientData,
  Patient,
  RestrictedPatientData,
} from "../types";
import { PatientDataSchema } from "../utils/newPatient";
import { z } from "zod";
import {
  BaseEntrySchema,
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
} from "../utils/newEntry";

export const patientsRouter = express.Router();

const parseEntryMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    BaseEntrySchema.parse(req.body);

    interface PartialParsedEntry extends Omit<BaseEntry, "id"> {
      type: "HealthCheck" | "OccupationalHealthcare" | "Hospital";
    }

    const entry = req.body as PartialParsedEntry;

    switch (entry.type) {
      case "HealthCheck":
        HealthCheckEntrySchema.parse(req.body);
        break;
      case "OccupationalHealthcare":
        OccupationalHealthcareEntrySchema.parse(req.body);
        break;
      case "Hospital":
        HospitalEntrySchema.parse(req.body);
        break;
      default:
        throw new Error("No type matched");
    }

    next();
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      next(error);
    }
  }
};

const parsePatientMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    PatientDataSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

patientsRouter.get("/", (_req, res: Response<RestrictedPatientData[]>) => {
  res.send(patientService.getRestrictedPatientsData());
});

patientsRouter.get(
  "/:id",
  (req: Request, res: Response<Patient | { error: string }>) => {
    const id = req.params.id;

    const patient = patientService.getPatient(id);

    if (!patient) {
      res.status(404).send({ error: "patient id not found" });
    } else {
      res.status(200).json(patient);
    }
  }
);

patientsRouter.post(
  "/",
  parsePatientMiddleware,
  (
    req: Request<unknown, unknown, ParsedPatientData>,
    res: Response<Patient>
  ) => {
    const addedPatient = patientService.addPatient(req.body);

    res.json(addedPatient);
  }
);

patientsRouter.post(
  "/:id/entries",
  parseEntryMiddleware,
  (
    req: Request<{ id: string }, unknown, IdlessEntry>,
    res: Response<Entry>
  ) => {
    const id = req.params.id;

    // extra step (parsing) due to FSO 9.27 specific requirements; will always add a diagnosisCodes field, as an [] if its missing
    // const entryWithParsedDiagnosisCodes = {
    //   ...req.body,
    //   diagnosisCodes: parseDiagnosisCodesOf(req.body),
    // };

    const addedEntry = patientService.addEntryToPatient(id, req.body);

    res.json(addedEntry);
  }
);

patientsRouter.use(errorMiddleware);
