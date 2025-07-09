import React from "react";
import ReactDOM from "react-dom/client";
import App from './app.jsx'; // ✅ Explicit extension
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
