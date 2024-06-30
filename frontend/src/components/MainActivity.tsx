import { Box } from "@mui/material";
import { observer } from "mobx-react";
import BulkDataUploadOptions from "./BulkDataUploadOptions";
import PeptideSelect from "./PeptideSelect";
import AnnotatedSpectrum from "./TestVisualizer";
import GlobalSettingsButton from "./buttons/GlobalSettingsButton";
import { testPeptide, testPlotData } from "./testdata";

const MainActivity = () => {
  const testData = [
    { x: 1, y: 20 },
    { x: 2, y: 40 },
    { x: 3, y: 30 },
    { x: 4, y: 60 },
    { x: 5, y: 90 },
  ];

  return (
    <Box
      sx={{
        padding: "0px 5px 10px 10px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          zIndex: 100,
        }}
      >
        <BulkDataUploadOptions />
      </div>

      <PeptideSelect />
      {/* <IPSAVisualizer data={testData} /> */}

      <AnnotatedSpectrum
        peptide={testPeptide}
        plotdata={testPlotData}
        settings={{
          toleranceThreshold: 10,
          toleranceType: "ppm",
          ionizationMode: "+",
        }}
      />

      {/* Floating Settings Button */}
      <GlobalSettingsButton />
    </Box>
  );
};

export default observer(MainActivity);
