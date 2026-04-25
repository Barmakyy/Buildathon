import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TutorPage from './pages/TutorPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tutor" element={<TutorPage />} />
        {/* Fallback to landing page if route not found */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
