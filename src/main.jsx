import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Mines from "./Mines.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <Mines/>
  </StrictMode>
);