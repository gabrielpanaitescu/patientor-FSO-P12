import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Diagnosis } from "../types";

const url = `${apiBaseUrl}/diagnoses`;

const getAllDiagnoses = async () => {
  const { data } = await axios.get<Diagnosis[]>(url);

  return data;
};

export default {
  getAllDiagnoses,
};
