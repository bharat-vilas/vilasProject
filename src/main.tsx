import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./app/main-page/App";
// import Login from "./app/admin/login"; // You can leave this for later

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* ✅ Render App at root */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
