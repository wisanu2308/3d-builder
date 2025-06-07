import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import App from "./App.jsx";
import AnyaForger from "./routes/_AnyaForger.jsx";
import Example from "./routes/_Example.jsx";
import NikeTape from "./routes/product/NikeTape.jsx";
import NikeSweater from "./routes/product/Sweater.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/anya-forger" element={<AnyaForger />} />
        <Route path="/example" element={<Example />} />
        <Route path="/nike-tape" element={<NikeTape />} />
        <Route path="/nike-sweater" element={<NikeSweater />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
