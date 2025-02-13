import { Box, List, ListItem, Paper, Stack, Typography } from "@mui/material";
import { Entry } from "../../../types";
import { DiagnosesByCode } from "../PatientInfo";
import { HealthCheckEntryDetails } from "./HealthCheckEntryDetails";
import { OccupationalHealthcareEntryDetails } from "./OccupationalHealthcareEntryDetails";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import { HospitalEntryDetails } from "./HospitalEntryDetails";
import { exhaustiveCheck } from "../../../utils";

interface Props {
  entry: Entry;
  diagnosesByCode: DiagnosesByCode;
}

const EntryDetails = ({ entry, diagnosesByCode }: Props) => {
  const iconMap = {
    Hospital: <LocalHospitalIcon />,
    HealthCheck: <MedicalServicesIcon />,
    OccupationalHealthcare: <WorkIcon />,
  };

  const specificEntryTypeDetails = () => {
    switch (entry.type) {
      case "HealthCheck":
        return <HealthCheckEntryDetails entry={entry} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntryDetails entry={entry} />;
      case "Hospital":
        return <HospitalEntryDetails entry={entry} />;
      default:
        exhaustiveCheck(entry);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        padding: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Stack direction="row" gap={1}>
        <Typography variant="body1">
          <strong>Date:</strong> {entry.date}
        </Typography>
        {iconMap[entry.type]}
      </Stack>
      <Typography variant="body1">
        <strong>Description:</strong> {entry.description}
      </Typography>

      {entry.diagnosisCodes && Object.keys(diagnosesByCode).length > 0 ? (
        <Box>
          <Typography variant="body1">
            <strong>Diagnosis codes:</strong>
          </Typography>
          <List>
            {entry.diagnosisCodes.map((code) => (
              <ListItem key={code}>
                <strong>{code}</strong>: {diagnosesByCode[code].name}
              </ListItem>
            ))}
          </List>
        </Box>
      ) : null}

      {specificEntryTypeDetails()}
      <Typography variant="body1">
        <em>diagnose by</em> {entry.specialist}
      </Typography>
    </Paper>
  );
};

export default EntryDetails;
