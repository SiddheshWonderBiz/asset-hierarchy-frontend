import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignalsPage from "./pages/SignalsPage";
import LogsPage from "./pages/LogsPage";
import Header from "./components/Header";
import AuthSuccess from "./pages/AuthSuccess";
import "react-toastify/dist/ReactToastify.css";
import { fetchCurrentUser } from "./utils/api";
import { ToastContainer } from "react-toastify";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await fetchCurrentUser(); // backend reads JWT from HttpOnly cookie
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // you can replace with spinner

  return isAuthenticated ? children : <Navigate to="/login" />;
};

//   Wrapper to handle conditional header
const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeader = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}{" "}
      {/* only show header if not on login/signup */}
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
              <Route path="/auth-success" element={<AuthSuccess />} />

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
                path="/logs"
                element={
                  <PrivateRoute>
                    <LogsPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </DndProvider>
        </Layout>
      </Router>
    </>
  );
}
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
