import { createTheme } from "@mui/material";

export default createTheme({
  palette: {
    primary: {
      main: "#8c53a2",
    },
  },
  typography: {
    fontSize: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 700,
          textTransform: "none",
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        notched: true,
      },
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-input": {
            display: "flex",
            margin: "0",
            padding: "6px 14px",
            minWidth: "50px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
        },
      },
    },
  },
});
