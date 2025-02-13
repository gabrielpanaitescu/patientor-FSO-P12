import { Diagnosis, DiagnosisCode } from "../types";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (
  currentCode: DiagnosisCode,
  selectedCodes: DiagnosisCode[],
  theme: Theme
) => {
  return {
    fontWeight: selectedCodes.includes(currentCode)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
};

interface Props {
  diagnoses: Diagnosis[];
  selectedDiagnosisCodes: DiagnosisCode[];
  setSelectedDiagnosisCodes: React.Dispatch<
    React.SetStateAction<DiagnosisCode[]>
  >;
}

export const MultipleSelect = ({
  diagnoses,
  selectedDiagnosisCodes,
  setSelectedDiagnosisCodes,
}: Props) => {
  const theme = useTheme();
  const diagnosisCodesSource = diagnoses.map((v) => v.code);

  const handleChange = (
    e: SelectChangeEvent<typeof selectedDiagnosisCodes>
  ) => {
    const {
      target: { value },
    } = e;

    setSelectedDiagnosisCodes(
      typeof value === "string" ? value.split(", ") : value
    );
  };

  return (
    <FormControl sx={{ marginY: 1, width: 200 }}>
      <InputLabel id="diagnosis-codes-label">Codes</InputLabel>
      <Select
        labelId="diagnosis-codes-label"
        id="diagnosis-codes"
        multiple
        value={selectedDiagnosisCodes}
        onChange={handleChange}
        input={<OutlinedInput id="select-diagnosis-codes" label="Codes" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {diagnosisCodesSource.map((code) => (
          <MenuItem
            key={code}
            value={code}
            style={getStyles(code, selectedDiagnosisCodes, theme)}
          >
            {code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
