import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { observer } from "mobx-react";
import PeptideStore from "../stores/PeptideStore";

const PeptideSelect = observer(() => {
  const handleChange = (event: SelectChangeEvent) => {
    PeptideStore.setSelectedPeptide(event.target.value as string);
  };

  return (
    <FormControl>
      <InputLabel id="peptide-select-label">Select Peptide</InputLabel>
      <Select
        label="Select Peptide"
        labelId="peptide-select-label"
        value={PeptideStore.selectedPeptide}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => selected || <em>None selected</em>}
      >
        {PeptideStore.peptides.map((peptide, index) => (
          <MenuItem
            key={index}
            value={`${peptide.Sequence} | ${peptide.Scan} | ${peptide.Modification}`}
          >
            {`${peptide.Sequence} | Scan: ${peptide.Scan} | Mods: ${peptide.Modification}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default PeptideSelect;
