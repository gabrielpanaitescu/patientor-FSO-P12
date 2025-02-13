import { Box, Divider, Stack, Typography } from "@mui/material";
import { HospitalEntry } from "../../../types";

interface Props {
  entry: HospitalEntry;
}

export const HospitalEntryDetails = ({ entry }: Props) => {
  if (!entry.discharge) return null;
  return (
    <Stack gap={1}>
      <Divider />
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        Discharge
      </Typography>
      <Box paddingLeft={1}>
        <Typography variant="body1">
          Criteria: {entry.discharge.criteria}
        </Typography>
        <Typography variant="body1">Date: {entry.discharge.date}</Typography>
      </Box>
      <Divider />
    </Stack>
  );
};
