import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import SignalsPage from './pages/SignalsPage';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

function App() {


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signals/:assetId" element={<SignalsPage />} />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
     
    </>
  );
}

export default App
