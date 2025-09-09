import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignalsPage from './pages/SignalsPage';
import LogsPage from './pages/LogsPage';
import Header from './components/Header'; // ✅ import header
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { getAuthToken } from './utils/api.js';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const PrivateRoute = ({ children }) => {
  const token = getAuthToken();
  return token ? children : <Navigate to="/login" />;
};

// ✅ Wrapper to handle conditional header
const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeader = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />} {/* only show header if not on login/signup */}
      {children}
    </>
  );
};

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Layout>
          <DndProvider backend={HTML5Backend}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/signals/:assetId"
              element={
                <PrivateRoute>
                  <SignalsPage />
                </PrivateRoute>
              }
            />
            <Route
            path='/logs'
            element={
              <PrivateRoute>
                <LogsPage />
              </PrivateRoute>
            }/>
          </Routes>
          </DndProvider>
        </Layout>
      </Router>
    </>
  );
}

export default App;
