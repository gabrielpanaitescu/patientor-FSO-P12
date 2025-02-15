import PatientModel from "../../mongo/models/patient";
import {
  HealthCheckModel,
  OccupationalHealthcareModel,
  HospitalModel,
} from "../../mongo/models/entry";
import {
  Entry,
  IdlessEntry,
  ParsedPatientData,
  Patient,
  RestrictedPatientData,
} from "../types";
import { HydratedDocument } from "mongoose";

const getRestrictedPatientsData = async (): Promise<
  RestrictedPatientData[]
> => {
  const patientsData = await PatientModel.find()
    .select("-ssn")
    .populate("entries");

  console.log("patientsData", patientsData);

  return patientsData;
};

const addPatient = async (patient: ParsedPatientData): Promise<Patient> => {
  const newPatient = new PatientModel({
    ...patient,
    entries: [],
  });

  await newPatient.save();

  return newPatient;
};

const getPatient = async (id: string): Promise<Patient | null> => {
  const foundPatient = await PatientModel.findById(id)
    .populate("entries")
    .exec();

  return foundPatient;
};

const addEntryToPatient = async (
  id: string,
  entry: IdlessEntry
): Promise<Entry> => {
  let newEntry: HydratedDocument<IdlessEntry>;

  if (entry.type === "HealthCheck") {
    newEntry = new HealthCheckModel(entry);
  } else if (entry.type === "OccupationalHealthcare") {
    newEntry = new OccupationalHealthcareModel(entry);
  } else if (entry.type === "Hospital") {
    newEntry = new HospitalModel(entry);
  } else {
    throw new Error("Entry type unresolved");
  }

  await newEntry.save();

  const patient = await PatientModel.findById(id);
  if (!patient) throw new Error("Patient with the specified id not found");
  patient.entries = patient.entries.concat(newEntry._id);
  await patient.save();

  return newEntry;
};

export default {
  getRestrictedPatientsData,
  addPatient,
  getPatient,
  addEntryToPatient,
};
