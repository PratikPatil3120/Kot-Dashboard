import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";


console.log("✅ main.jsx loaded");

const rootEl = document.getElementById("root");
console.log("✅ root element:", rootEl);

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
