import SettingsIcon from "@mui/icons-material/Settings";
import { Box, IconButton, Popover } from "@mui/material";
import { useState } from "react";

const GlobalSettingsButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "global-settings-popover" : undefined;

  return (
    <>
      <IconButton
        color="primary"
        aria-label="settings"
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <SettingsIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box p={2}>
          <div>Settings Content Here</div>
        </Box>
      </Popover>
    </>
  );
};

export default GlobalSettingsButton;
