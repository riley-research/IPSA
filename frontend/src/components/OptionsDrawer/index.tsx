import { Drawer, Stack } from "@mui/material";
import { observer } from "mobx-react";
import FragmentationSettings from "./FragmentationSettings";
import GeneralSettings from "./GeneralSettings";

const OptionsDrawer = observer(() => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 300,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 300,
          boxSizing: "border-box",
          background: "#d5eded",
          borderRadius: "44px 44px 0px 0px",
          top: "auto",
        },
      }}
    >
      <Stack
        gap={2}
        direction="column"
        alignItems="center"
        sx={{
          height: "100%",
          padding: "20px",
        }}
      >
        <GeneralSettings />
        <FragmentationSettings />
      </Stack>
    </Drawer>
  );
});

export default OptionsDrawer;
