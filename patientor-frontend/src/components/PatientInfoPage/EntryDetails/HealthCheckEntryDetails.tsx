import { HealthCheckEntry, HealthCheckRating } from "../../../types";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { exhaustiveCheck } from "../../../utils";

interface Props {
  entry: HealthCheckEntry;
}

export const HealthCheckEntryDetails = ({ entry }: Props) => {
  let color: string | null;

  switch (entry.healthCheckRating) {
    case HealthCheckRating.Healthy:
      color = "red";
      break;
    case HealthCheckRating.LowRisk:
      color = "orange";
      break;
    case HealthCheckRating.HighRisk:
      color = "yellow";
      break;
    case HealthCheckRating.CriticalRisk:
      color = "black";
      break;
    default:
      color = null;
      exhaustiveCheck(entry.healthCheckRating);
  }

  return <FavoriteIcon sx={{ color: color ? color : "" }} />;
};
