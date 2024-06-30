import { Box, Stack, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react";
import PeptideStore from "../../stores/PeptideStore";

const GeneralSettings = observer(() => {
  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: "1px 1px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        General Settings
      </Typography>
      <Stack direction="row" gap={2}>
        <TextField
          label="Precursor Charge"
          type="number"
          variant="outlined"
          value={PeptideStore.precursorCharge}
          onChange={(e) =>
            PeptideStore.setPrecursorCharge(parseInt(e.target.value))
          }
          sx={{
            width: "45%",
            "& .MuiInputLabel-root": { fontSize: "0.65rem" }, // Decrease label font size
          }}
          margin="normal"
        />
        <TextField
          label="Max Fragment Charge"
          type="number"
          variant="outlined"
          value={PeptideStore.maxFragmentCharge}
          onChange={(e) =>
            PeptideStore.setMaxFragmentCharge(parseInt(e.target.value))
          }
          sx={{
            width: "55%",
            "& .MuiInputLabel-root": { fontSize: "0.65rem" }, // Decrease label font size
          }}
          margin="normal"
        />
      </Stack>
      <TextField
        label="Fragment Tolerance (ppm)"
        type="number"
        variant="outlined"
        value={PeptideStore.fragmentTolerance}
        onChange={(e) =>
          PeptideStore.setFragmentTolerance(parseFloat(e.target.value))
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Matching Threshold (%)"
        type="number"
        variant="outlined"
        value={PeptideStore.matchingThreshold}
        onChange={(e) =>
          PeptideStore.setMatchingThreshold(parseFloat(e.target.value))
        }
        fullWidth
        margin="normal"
      />
    </Box>
  );
});

export default GeneralSettings;
