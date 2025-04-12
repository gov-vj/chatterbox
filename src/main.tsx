import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import LoginPage from "./pages/LoginPage";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route for the login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Placeholder for the chat page (we'll protect it later) */}
        <Route path="/chat" element={<div>Chat Page Placeholder</div>} />

        {/* Redirect root path to login page initially */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* You might have other routes within App or handle them differently */}
        {/* Example if App contains other layout: <Route path="/*" element={<App />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
