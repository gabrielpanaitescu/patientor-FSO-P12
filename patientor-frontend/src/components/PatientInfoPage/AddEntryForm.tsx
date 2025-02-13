import { useState } from "react";
import {
  BaseEntry,
  Diagnosis,
  DiagnosisCode,
  EntryFormValues,
  HealthCheckRating,
} from "../../types";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MultipleSelect } from "../MultipleSelect";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface Props {
  diagnoses: Diagnosis[];
  entryType: string;
  open: boolean;
  addNewEntry: (values: EntryFormValues) => void;
  cancelEntrySubmission: () => void;
}

interface HealthCheckRatingOption {
  label: string;
  value: HealthCheckRating;
}
const healthCheckRatingEntries = Object.entries(HealthCheckRating).slice(
  Math.ceil(Object.entries(HealthCheckRating).length / 2)
);

const healthCheckRatingOptions: HealthCheckRatingOption[] =
  healthCheckRatingEntries.map((arr) => {
    return {
      label: arr[0].toString(),
      value: arr[1] as HealthCheckRating,
    };
  });

export const AddEntryForm = ({
  diagnoses,
  entryType,
  open,
  addNewEntry,
  cancelEntrySubmission,
}: Props) => {
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<
    DiagnosisCode[]
  >([]);
  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy
  );
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");
  const [sickLeaveToggle, setSickLeaveToggle] = useState(false);
  const [dischargeDate, setDischargeDate] = useState("");
  const [criteria, setCriteria] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseEntryValues: Omit<BaseEntry, "id"> = {
      date,
      specialist,
      description,
    };

    if (selectedDiagnosisCodes.length > 0)
      baseEntryValues.diagnosisCodes = selectedDiagnosisCodes;

    switch (entryType) {
      case "Hospital":
        addNewEntry({
          ...baseEntryValues,
          type: "Hospital",
          discharge: {
            date,
            criteria,
          },
        });
        break;

      case "HealthCheck":
        addNewEntry({
          ...baseEntryValues,
          type: "HealthCheck",
          healthCheckRating: healthCheckRating,
        });
        break;
      case "OccupationalHealthcare":
        const entry: EntryFormValues = {
          ...baseEntryValues,
          type: "OccupationalHealthcare",
          employerName,
        };

        if (sickLeaveToggle) {
          entry.sickLeave = {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate,
          };
        }

        addNewEntry(entry);
        break;

      default:
        break;
    }

    setDate("");
    setSpecialist("");
    setDescription("");
    setSelectedDiagnosisCodes([]);
    setHealthCheckRating(HealthCheckRating.Healthy);
    setEmployerName("");
    setSickLeaveToggle(false);
    setSickLeaveStartDate("");
    setSickLeaveEndDate("");
    setCriteria("");
    setDischargeDate("");
  };

  const handleHealthRatingChange = (e: SelectChangeEvent<number>) => {
    if (typeof e.target.value === "number") {
      const value = e.target.value;
      const healthCheckRatingValue = Object.values(HealthCheckRating)
        .filter((v) => typeof v === "number")
        .find((v) => v === value);

      if (healthCheckRatingValue !== undefined) {
        setHealthCheckRating(healthCheckRatingValue);
      }
    }
  };

  return (
    <>
      <Typography variant="h6">New Entry</Typography>
      <form onSubmit={handleSubmit}>
        <Stack direction="column" alignItems="start" gap={1}>
          <TextField
            sx={{ alignSelf: "start" }}
            label="Date"
            type="date"
            required
            value={date}
            onChange={({ target }) => setDate(target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            required
            label="Specialist"
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
          />
          <TextField
            required
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <MultipleSelect
            diagnoses={diagnoses}
            selectedDiagnosisCodes={selectedDiagnosisCodes}
            setSelectedDiagnosisCodes={setSelectedDiagnosisCodes}
          />
          {entryType === "HealthCheck" && (
            <FormControl>
              <InputLabel id="healthCheckRating" sx={{ fontSize: "0.9rem" }}>
                Health Check Rating *
              </InputLabel>
              <Select
                sx={{ width: 200, fontSize: "0.85rem" }}
                labelId="healthCheckRating"
                label="Health Check Rating *"
                value={healthCheckRating}
                onChange={handleHealthRatingChange}
              >
                {healthCheckRatingOptions.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {entryType === "OccupationalHealthcare" && (
            <>
              <TextField
                required
                label="Employer name"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
              />
              <Button
                sx={{ marginTop: 1 }}
                onClick={() => setSickLeaveToggle((prev) => !prev)}
                variant="contained"
                size="small"
                startIcon={
                  sickLeaveToggle ? <VisibilityIcon /> : <VisibilityOffIcon />
                }
              >
                Sick leave
              </Button>

              <Stack sx={{ marginLeft: 0.25 }}>
                {sickLeaveToggle && (
                  <Stack gap={0.25} paddingLeft={1.5}>
                    <InputLabel
                      id="sick-leave-start-date"
                      sx={{ fontSize: "0.85rem" }}
                    >
                      Start date *
                    </InputLabel>
                    <Input
                      id="sick-leave-start-date"
                      type="date"
                      required
                      value={sickLeaveStartDate}
                      onChange={({ target }) =>
                        setSickLeaveStartDate(target.value)
                      }
                    />
                    <InputLabel
                      id="sick-leave-end-date"
                      sx={{ fontSize: "0.85rem" }}
                    >
                      End date *
                    </InputLabel>
                    <Input
                      id="sick-leave-end-date"
                      type="date"
                      required
                      value={sickLeaveEndDate}
                      onChange={({ target }) =>
                        setSickLeaveEndDate(target.value)
                      }
                    />
                  </Stack>
                )}
              </Stack>
            </>
          )}
          {entryType === "Hospital" && (
            <>
              <Typography
                sx={{
                  color: "#333",
                  fontSize: "0.95rem",
                  marginLeft: 1,
                  marginBottom: 0.5,
                }}
                variant="body1"
              >
                Discharge *
              </Typography>
              <Stack gap={1} paddingLeft={2}>
                <TextField
                  required
                  label="Criteria"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                />
                <Box paddingLeft={0.25}>
                  <InputLabel id="discharge-date" sx={{ fontSize: "0.85rem" }}>
                    Date *
                  </InputLabel>
                  <Input
                    id="discharge-date"
                    type="date"
                    required
                    value={dischargeDate}
                    onChange={({ target }) => setDischargeDate(target.value)}
                  />
                </Box>
              </Stack>
            </>
          )}
        </Stack>
        <Stack direction="row" gap={1} marginTop={3}>
          <Button
            color="error"
            size="small"
            variant="outlined"
            type="button"
            onClick={() => cancelEntrySubmission()}
          >
            cancel
          </Button>
          <Button size="small" variant="outlined" color="success" type="submit">
            submit
          </Button>
        </Stack>
      </form>
    </>
  );
};
