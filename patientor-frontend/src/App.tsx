import { useState, useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "./constants";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { Diagnosis, Patient } from "./types";
import diagnosesService from "./services/diagnoses";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import { PatientInfo } from "./components/PatientInfoPage/PatientInfo";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };

    const fetchDiagnosisList = async () => {
      const diagnoses = await diagnosesService.getAllDiagnoses();

      setDiagnoses(diagnoses);
    };

    void fetchPatientList();
    void fetchDiagnosisList();

    return setTriggerRefetch(false);
  }, [triggerRefetch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route
              path="/"
              element={
                <PatientListPage
                  patients={patients}
                  setPatients={setPatients}
                />
              }
            />
            <Route
              path="/:id"
              element={
                <PatientInfo
                  diagnoses={diagnoses}
                  setTriggerRefetch={setTriggerRefetch}
                />
              }
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
