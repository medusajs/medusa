import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import KitchenSink from "./providers";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <KitchenSink>
      <App />
    </KitchenSink>
  </React.StrictMode>
);
