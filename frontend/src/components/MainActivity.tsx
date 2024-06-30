import { Box } from "@mui/material";
import { observer } from "mobx-react";
import BulkDataUploadOptions from "./BulkDataUploadOptions";
import GlobalSettingsButton from "./buttons/GlobalSettingsButton";

const MainActivity = () => {
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

      {/* Floating Settings Button */}
      <GlobalSettingsButton />
    </Box>
  );
};

export default observer(MainActivity);
