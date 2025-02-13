import { Diagnosis } from "../types";
import diagnosesData from "../../data/diagnoses";

const getDiagnoses = (): Diagnosis[] => {
  return diagnosesData;
};

export default {
  getDiagnoses,
};
