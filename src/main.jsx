import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import App from "./App.jsx";
import Backpack from "./routes/Backpack.jsx";
import AnyaForger from "./routes/_AnyaForger.jsx";
import Example from "./routes/_Example.jsx";
import TShirt from "./routes/TShirt.jsx";
// import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/anya-forger" element={<AnyaForger />} />
        <Route path="/example" element={<Example />} />
        <Route path="/backpack" element={<Backpack />} />
        <Route path="/tshirt" element={<TShirt />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
