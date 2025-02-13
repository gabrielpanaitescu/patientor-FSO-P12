import { useState } from "react";
import {
  Box,
  Table,
  Button,
  TableHead,
  Typography,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import axios from "axios";

import { PatientFormValues, Patient } from "../../types";
import AddPatientModal from "../AddPatientModal";

import HealthRatingBar from "../HealthRatingBar";

import patientService from "../../services/patients";
import { Link } from "react-router-dom";

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const PatientListPage = ({ patients, setPatients }: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const patient = await patientService.create(values);
      setPatients(patients.concat(patient));
      setModalOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          console.log("Unrecognized axios error", error);
          setError("Unrecognized axios error");
        } else if (typeof error.response.data === "object") {
          const message = error.response.data.error
            .map(
              (error: { path: string[]; message: string }) =>
                `Error on field '${error.path[0]}': ${error.message}`
            )
            .join("\n");
          setError(message);
          console.log(error);
        } else if (typeof error.response.data === "string") {
          console.log(error);
          setError(error.response.data);
        }
      } else {
        console.log("Unknown error", error);
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(patients).map((patient: Patient) => {
            const patientHealthCheckRatingData = patient.entries
              .map((entry) => {
                if (
                  entry.type === "HealthCheck" &&
                  entry.healthCheckRating !== undefined
                ) {
                  return entry.healthCheckRating;
                } else {
                  return null;
                }
              })
              .filter((v) => v !== null);

            const healthCheckAverage: number | null =
              patientHealthCheckRatingData.length < 1
                ? null
                : patientHealthCheckRatingData.reduce(
                    (accum, currValue) => accum + currValue
                  ) / patientHealthCheckRatingData.length;

            return (
              <TableRow key={patient.id}>
                <TableCell>
                  <Link to={`/${patient.id}`}>{patient.name}</Link>
                </TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.occupation}</TableCell>
                <TableCell>
                  {healthCheckAverage !== null ? (
                    <HealthRatingBar
                      showText={false}
                      rating={healthCheckAverage}
                    />
                  ) : (
                    <Typography variant="body2">No data yet</Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
