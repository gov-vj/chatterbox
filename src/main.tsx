import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from './components/ProtectedRoute'

// eslint-disable-next-line react-refresh/only-export-components
const ChatPagePlaceholder = () => <div>Chat Page</div>;

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<ChatPagePlaceholder />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div style={{ padding: '50px', textAlign: 'center' }}><h2>404 - Page Not Found</h2></div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
