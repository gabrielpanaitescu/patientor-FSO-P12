import { useState, SyntheticEvent } from "react";

import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
  Stack,
} from "@mui/material";

import { PatientFormValues, Gender } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: PatientFormValues) => void;
}

interface GenderOption {
  value: Gender;
  label: string;
}

const genderOptions: GenderOption[] = Object.values(Gender).map((v) => ({
  value: v,
  label: v.toString(),
}));

const AddPatientForm = ({ onCancel, onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [ssn, setSsn] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(Gender.Other);

  const onGenderChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const gender = Object.values(Gender).find((g) => g.toString() === value);
      if (gender) {
        setGender(gender);
      }
    }
  };

  const addPatient = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      name,
      occupation,
      ssn,
      dateOfBirth,
      gender,
    });
  };

  return (
    <div>
      <form onSubmit={addPatient}>
        <Stack gap={1} marginBottom={1.5}>
          <TextField
            required
            label="Name"
            fullWidth
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
          <TextField
            sx={{
              alignSelf: "start",
              marginTop: 1,
            }}
            label="Date of birth"
            type="date"
            required
            value={dateOfBirth}
            onChange={({ target }) => setDateOfBirth(target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/* native html date picker
            <label style={{ color: "#333" }}>
            Date of birth:{" "}
            <input
              required
              style={{
                alignSelf: "start",
                padding: "4px 8px",
                border: "1px solid grey",
                color: "#333",
                borderRadius: 5,
              }}
              type="date"
              value={dateOfBirth}
              onChange={({ target }) => setDateOfBirth(target.value)}
            />
          </label> */}
          <TextField
            required
            label="Social security number"
            fullWidth
            value={ssn}
            onChange={({ target }) => setSsn(target.value)}
          />

          <TextField
            required
            label="Occupation"
            fullWidth
            value={occupation}
            onChange={({ target }) => setOccupation(target.value)}
          />

          <InputLabel>Gender</InputLabel>
          <Select
            label="Gender"
            fullWidth
            value={gender}
            onChange={onGenderChange}
          >
            {genderOptions.map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddPatientForm;
