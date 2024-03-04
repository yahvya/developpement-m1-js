import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./global/app.css";
import App from "./App";

ReactDOM
    .createRoot(document.querySelector("#root"))
    .render(<App/>);

reportWebVitals();