import { Box, Paper, Typography } from "@mui/material";
import { observer } from "mobx-react";
import FragmentationStore from "../../stores/FragmentationStore";
import CircularSelectButton from "../buttons/CircularSelectButton";

const nTerminalIons = ["a", "b", "c"];
const cTerminalIons = ["x", "y", "z"];

const FragmentationSettings = () => {
  const toggleNTerminal = (ion: string) => {
    FragmentationStore.toggleNTerminal(ion);
  };

  const toggleCTerminal = (ion: string) => {
    FragmentationStore.toggleCTerminal(ion);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        padding: "10px 20px",
        borderRadius: 2,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: 16,
          fontWeight: "medium",
          color: "#333",
          textAlign: "left",
          width: "100%",
        }}
      >
        Fragmentation Settings
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          mt: 2,
          fontWeight: "bold",
          color: "#555",
          textAlign: "left",
          width: "100%",
        }}
      >
        N-terminal
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        {nTerminalIons.map((ion) => (
          <CircularSelectButton
            key={ion}
            label={ion}
            isSelected={FragmentationStore.nTerminalSelected.includes(ion)}
            onClick={() => toggleNTerminal(ion)}
          />
        ))}
      </Box>
      <Typography
        variant="subtitle2"
        sx={{
          mt: 2,
          fontWeight: "bold",
          color: "#555",
          textAlign: "left",
          width: "100%",
        }}
      >
        C-terminal
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 2 }}>
        {cTerminalIons.map((ion) => (
          <CircularSelectButton
            key={ion}
            label={ion}
            isSelected={FragmentationStore.cTerminalSelected.includes(ion)}
            onClick={() => toggleCTerminal(ion)}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default observer(FragmentationSettings);
