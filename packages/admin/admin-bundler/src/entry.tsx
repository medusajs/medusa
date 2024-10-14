import App from "@medusajs/dashboard";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("medusa")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


if (import.meta.hot) {
    import.meta.hot.accept()
}
