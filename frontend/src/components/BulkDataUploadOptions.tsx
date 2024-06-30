import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { Button, ButtonGroup, Stack, SvgIcon, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import DataUploadStore from "src/stores/DataUploadStore";
import UserStore from "src/stores/UserStore";
import DataSelect from "./DataSelect";
import PeptideSelect from "./PeptideSelect";

const BulkDataUploadOptions: React.FC = () => {
  useEffect(() => {
    if (DataUploadStore.files.size > 0) {
      UserStore.loadSelectedFiles();
    }
  }, [DataUploadStore.files.keys()]);
  return (
    <Stack gap={6} marginTop="15px" marginLeft={"10px"}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={4}
      >
        <Stack direction="row" gap={2} alignItems="end" flexWrap={"wrap"}>
          <DataSelect labelText="Identifications" fileType="Identifications" />
          <DataSelect labelText="Peak List" fileType="PeakList" />
          <DataSelect labelText="Modifications" fileType="Modifications" />
          <PeptideSelect />
        </Stack>
        <ButtonGroup
          variant="contained"
          color="primary"
          disableElevation
          sx={{
            height: "36px",
            "& .MuiButtonGroup-grouped": {
              border: "none",
              borderRadius: "6px",
              "&:not(:last-of-type)": {
                borderRight: "none",
              },
            },
          }}
        >
          <Button variant="contained" color="primary">
            <Stack direction="row" gap={2} alignItems="center">
              <SvgIcon
                component={AutoGraphIcon}
                viewBox="0 0 24 24"
                sx={{ fontSize: 24, color: "white" }}
              />
              <Typography color="white" fontWeight="bold" variant="h6">
                Visualize
              </Typography>
            </Stack>
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
};

export default observer(BulkDataUploadOptions);
