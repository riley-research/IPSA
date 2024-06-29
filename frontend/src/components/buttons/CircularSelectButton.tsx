import { IconButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

interface CircularSelectButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const CircularSelectButton = ({
  label,
  isSelected,
  onClick,
}: CircularSelectButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        width: 26,
        height: 26,
        backgroundColor: isSelected ? "#bce2e2" : grey[300],
        color: "black",
        border: `1.5px solid ${isSelected ? "#22a2a4" : "transparent"}`,
        "&:hover": {
          backgroundColor: "#95d6da",
        },
      }}
    >
      <Typography variant="body2">{label}</Typography>
    </IconButton>
  );
};

export default CircularSelectButton;
