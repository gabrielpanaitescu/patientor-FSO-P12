import { Stack, Typography, Divider, Box } from "@mui/material";
import { OccupationalHealthcareEntry } from "../../../types";

interface Props {
  entry: OccupationalHealthcareEntry;
}

export const OccupationalHealthcareEntryDetails = ({ entry }: Props) => {
  return (
    <Stack gap={1}>
      <Typography variant="body1">Employer: {entry.employerName}</Typography>

      {entry.sickLeave && (
        <>
          <Divider />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Sick leave
          </Typography>
          <Box paddingLeft={1.5}>
            <Typography variant="body1">
              Start date: {entry.sickLeave.startDate}
            </Typography>
            <Typography variant="body1">
              End date: {entry.sickLeave.endDate}
            </Typography>
          </Box>
          <Divider />
        </>
      )}
    </Stack>
  );
};
