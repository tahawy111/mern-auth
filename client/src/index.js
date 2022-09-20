import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./screens/Register";
import { ToastContainer } from "react-toastify";
import Activate from "./screens/Activate";
import Login from "./screens/Login";
import Forget from "./screens/Forget";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/users/password/forget" element={<Forget />} />
      <Route path="/users/activate/:token" element={<Activate />} />
    </Routes>
  </BrowserRouter>
);
