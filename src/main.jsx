import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Backpack from "./routes/Backpack.jsx";
import Tshirt from "./routes/Tshirt.jsx";
import Hat from "./routes/Hat.jsx";
import "./App.css";
// import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/backpack" element={<Backpack />} />
        <Route path="/tshirt" element={<Tshirt />} />
        <Route path="/hat" element={<Hat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
