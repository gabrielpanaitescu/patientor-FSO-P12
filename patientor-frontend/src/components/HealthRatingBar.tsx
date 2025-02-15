import { Rating } from "@mui/material";
import { Favorite } from "@mui/icons-material";

type BarProps = {
  rating: number;
  showText: boolean;
};

const HEALTHBAR_TEXTS = [
  "The patient is in great shape",
  "The patient has a low risk of getting sick",
  "The patient has a high risk of getting sick",
  "The patient has a diagnosed condition",
];

const HealthRatingBar = ({ rating, showText }: BarProps) => {
  return (
    <div className="health-bar">
      <Rating
        readOnly
        value={4 - rating}
        max={4}
        icon={<Favorite fontSize="inherit" style={{ color: "#E32636" }} />}
        emptyIcon={
          <Favorite
            stroke="#E32636"
            strokeWidth="1.5"
            fontSize="inherit"
            style={{ color: "white" }}
          />
        }
      />

      {showText ? <p>{HEALTHBAR_TEXTS[rating]}</p> : null}
    </div>
  );
};

export default HealthRatingBar;
