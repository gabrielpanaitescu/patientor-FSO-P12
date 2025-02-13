import {
  Diagnosis,
  DiagnosisCode,
  EntryFormValues,
  Patient,
} from "../../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import {
  Button,
  Divider,
  Stack,
  Typography,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import { useParams } from "react-router-dom";
import axios from "axios";
import EntryDetails from "./EntryDetails";
import { AddEntryForm } from "./AddEntryForm";

interface Props {
  diagnoses: Diagnosis[];
  setTriggerRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DiagnosesByCode {
  [key: DiagnosisCode]: Diagnosis;
}

export const PatientInfo = ({ diagnoses, setTriggerRefetch }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [entryType, setEntryType] = useState("");
  const { id } = useParams();

  const diagnosesByCode: DiagnosesByCode = {};

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (!id) throw new Error("Missing id");
        const patient = await patientService.getPatient(id);
        setPatient(patient);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.data &&
            typeof error.response.data === "string"
          ) {
            console.log("Axios error: ", error);
          } else {
            console.log("Unrecognized axios error", error);
          }
        } else {
          console.log("Unknown error: ", error);
        }
      }
    };

    void fetchPatient();
  }, [id]);

  if (!patient) return;

  const addNewEntry = async (values: EntryFormValues) => {
    try {
      const newEntry = await patientService.addEntry(values, patient.id);
      setPatient({
        ...patient,
        entries: patient.entries.concat(newEntry),
      });
      setError("");
      setFormOpen(false);
      setSuccess(`Entry successfully added`);
      setTriggerRefetch(true);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
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

  const cancelEntrySubmission = () => {
    setError("");
    setFormOpen(false);
  };

  const entryTypeOptions = [
    "HealthCheck",
    "Hospital",
    "OccupationalHealthcare",
  ];

  const handleEntryTypeChange = (e: SelectChangeEvent) => {
    setEntryType(e.target.value);
  };

  if (diagnoses) {
    const patientDiagnosisCodes = patient.entries
      .map((entry) => entry.diagnosisCodes)
      .flat();

    if (patientDiagnosisCodes.length > 0) {
      diagnoses
        .filter((diagnosis) => patientDiagnosisCodes.includes(diagnosis.code))
        .forEach((diagnosis) => (diagnosesByCode[diagnosis.code] = diagnosis));
    }
  }

  return (
    <Stack marginTop={3} gap={2}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="h4" component="h4">
          {patient.name}
        </Typography>
        {patient.gender === "male" ? (
          <MaleIcon />
        ) : patient.gender === "female" ? (
          <FemaleIcon />
        ) : null}
      </Stack>
      <Divider />
      <Typography variant="body1">ssn: {patient.ssn}</Typography>
      <Typography variant="body1">occupation: {patient.occupation}</Typography>
      <Divider />
      <Typography variant="h5" component="h5">
        Entries
      </Typography>
      <Stack gap={0.5}>
        <FormControl>
          <InputLabel id="type">Type</InputLabel>
          <Select
            sx={{ width: 200, fontSize: "0.85em" }}
            labelId="type"
            label="Type"
            value={entryType}
            onChange={handleEntryTypeChange}
          >
            {entryTypeOptions.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          disabled={Boolean(!entryType)}
          size="small"
          variant="contained"
          sx={{ alignSelf: "start", display: formOpen ? "none" : "block" }}
          onClick={() => setFormOpen(true)}
        >
          Add new entry
        </Button>
      </Stack>
      {success && <Alert severity="success">{success}</Alert>}
      {error && (
        <Alert severity="error">
          <pre>{error}</pre>
        </Alert>
      )}
      <AddEntryForm
        diagnoses={diagnoses}
        entryType={entryType}
        open={formOpen}
        addNewEntry={addNewEntry}
        cancelEntrySubmission={cancelEntrySubmission}
      />
      <Stack>
        {patient.entries.length > 0 ? (
          <Stack gap={2}>
            {patient.entries.map((entry) => (
              <EntryDetails
                key={entry.id}
                entry={entry}
                diagnosesByCode={diagnosesByCode}
              />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
};
