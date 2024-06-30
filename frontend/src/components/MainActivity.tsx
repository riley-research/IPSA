import { Box } from "@mui/material";
import { observer } from "mobx-react";
import BulkDataUploadOptions from "./BulkDataUploadOptions";
import OptionsDrawer from "./OptionsDrawer";
import AnnotatedSpectrum from "./TestVisualizer";
import GlobalSettingsButton from "./buttons/GlobalSettingsButton";
import { testPeptide, testPlotData } from "./testdata";

const MainActivity = () => {
  return (
    <Box
      sx={{
        padding: "0px 5px 10px 10px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        position: "relative",
        height: "100%", // Ensure the container takes full height
      }}
    >
      {/* BulkDataUploadOptions at the very top */}
      <div style={{ width: "100%", zIndex: 100 }}>
        <BulkDataUploadOptions />
      </div>

      {/* Flex container for the drawer and main content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row", // Horizontal layout to place drawer and content side by side
          flexGrow: 1, // Allow this container to take up all remaining space
          mt: 2, // Margin top to ensure it starts below the options
        }}
      >
        <OptionsDrawer />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 300px)` }, // Adjust width based on the drawer's width
          }}
        >
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
      </Box>
    </Box>
  );
};

export default observer(MainActivity);
