import axios from "axios";
import { Entry, EntryFormValues, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const url = `${apiBaseUrl}/patients`;

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(url);

  return data;
};

const getPatient = async (id: string) => {
  const { data } = await axios.get<Patient>(`${url}/${id}`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(url, object);

  return data;
};

const addEntry = async (object: EntryFormValues, id: string) => {
  console.log("object", object);

  const { data } = await axios.post<Entry>(`${url}/${id}/entries`, object);

  return data;
};

export default {
  getAll,
  getPatient,
  create,
  addEntry,
};
