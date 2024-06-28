import { ThemeProvider } from "@mui/material";
import "./App.css";
import MainActivity from "./components/MainActivity";
import mainTheme from "./theme";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={mainTheme}>
        <MainActivity />
      </ThemeProvider>
    </div>
  );
}

export default App;
