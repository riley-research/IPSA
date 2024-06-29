import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import { observer } from "mobx-react";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import UserStore from "../stores/UserStore";

interface Peptide {
  Scan: string;
  Sequence: string;
  Charge: string;
  Modification: string;
}

const PeptideSelect = observer(() => {
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [selectedPeptide, setSelectedPeptide] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPeptide(event.target.value as string);
  };

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const filePath = UserStore.selectedFiles["Identifications"];
        const storageRef = ref(storage, filePath);
        const url = await getDownloadURL(storageRef);

        const response = await fetch(url);
        const csvText = await response.text(); // Directly read text instead of using a reader

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const parsedData = results.data as Peptide[];
            setPeptides(parsedData);
          },
        });
      } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
      }
    };

    fetchCSV();
  }, []);

  return (
    <FormControl>
      <InputLabel id="peptide-select-label">Select Peptide</InputLabel>
      <Select
        labelId="peptide-select-label"
        label="Select Peptide"
        value={selectedPeptide}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          if (selected === "") {
            return <em>None selected</em>;
          }
          return selected;
        }}
      >
        {peptides.map((peptide, index) => (
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
