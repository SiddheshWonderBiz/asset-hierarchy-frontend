// AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchCurrentUser } from "../utils/api";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // The JWT cookie should already be set by the backend
        const user = await fetchCurrentUser();
        console.log("Logged in user via Google:", user);
        
        toast.success("Login successful!");
        navigate("/"); // redirect to home
      } catch (err) {
        console.error("Failed to fetch user after Google auth:", err);
        toast.error("Authentication failed");
        navigate("/login");
      }
    };

    handleAuthSuccess();
  }, [navigate]);

  return <div>Completing login...</div>;
};

export default AuthSuccess;