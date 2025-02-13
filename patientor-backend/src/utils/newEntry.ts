import { z } from "zod";
import { Diagnosis, HealthCheckRating } from "../types";

export const parseDiagnosisCodesOf = (
  object: unknown
): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

export const BaseEntrySchema = z.object({
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  type: z.enum(["HealthCheck", "OccupationalHealthcare", "Hospital"]),
});

export const HealthCheckEntrySchema = z.object({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

export const OccupationalHealthcareEntrySchema = z.object({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date(),
    })
    .optional(),
});

export const HospitalEntrySchema = z.object({
  type: z.literal("Hospital"),
  discharge: z
    .object({ date: z.string().date(), criteria: z.string() })
    .optional(),
});
