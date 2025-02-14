import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Mines from "./Mines.jsx";
import { LevelProvider } from "./contexts/LevelContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <LevelProvider>

      <Mines />
    </LevelProvider>
  </StrictMode>
);