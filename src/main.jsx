import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import App from "./App.jsx";
import Backpack from "./routes/Backpack.jsx";
import Hat from "./routes/Hat.jsx";
import ShortPant from "./routes/ShortPant.jsx";
import Tshirt from "./routes/Tshirt.jsx";
import ExampleMesh from "./routes/_Example.jsx";
// import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/example" element={<ExampleMesh />} />
        <Route path="/short-pant" element={<ShortPant />} />
        <Route path="/backpack" element={<Backpack />} />
        <Route path="/tshirt" element={<Tshirt />} />
        <Route path="/hat" element={<Hat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
