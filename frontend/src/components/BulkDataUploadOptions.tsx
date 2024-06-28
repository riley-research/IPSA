import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { Button, ButtonGroup, Stack, SvgIcon, Typography } from "@mui/material";
import React from "react";
import DataSelect from "./DataSelect";

const BulkDataUploadOptions: React.FC = () => {
  return (
    <Stack gap={6} marginTop="15px" marginLeft={"10px"}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={4}
      >
        <Stack direction="row" gap={2} alignItems="end" flexWrap={"wrap"}>
          <DataSelect labelText="Identifications" />
          <DataSelect />
          <DataSelect />
          <DataSelect />
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

export default BulkDataUploadOptions;
