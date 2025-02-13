import patientsData from "../../data/patients";
import {
  Entry,
  IdlessEntry,
  ParsedPatientData,
  Patient,
  RestrictedPatientData,
} from "../types";
import { v1 as uuid } from "uuid";

const getRestrictedPatientsData = (): RestrictedPatientData[] => {
  return patientsData.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );
};

const addPatient = (patient: ParsedPatientData): Patient => {
  const newPatient = {
    ...patient,
    id: uuid(),
    entries: [],
  };

  patientsData.push(newPatient);

  return newPatient;
};

const getPatient = (id: string): Patient | undefined => {
  const foundPatient = patientsData.find((patient) => patient.id === id);

  return foundPatient;
};

const addEntryToPatient = (id: string, entry: IdlessEntry): Entry => {
  const newEntry: Entry = {
    ...entry,
    id: uuid(),
  };

  const patient = patientsData.find((p) => p.id === id);
  if (!patient) throw new Error("Patient with the specified id not found");
  patient.entries = patient.entries.concat(newEntry);

  return newEntry;
};

export default {
  getRestrictedPatientsData,
  addPatient,
  getPatient,
  addEntryToPatient,
};
