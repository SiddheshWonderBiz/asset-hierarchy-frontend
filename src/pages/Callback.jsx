import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchCurrentUser } from "../utils/api";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        toast.error("Google login failed: No code returned");
        return;
      }

      try {
        // send the code to backend to exchange for JWT and set cookie
        await axios.post(
          "https://localhost:7092/api/Auth/google-callback",
          { code },
          { withCredentials: true } // important: cookie
        );

        // fetch user info
        const user = await fetchCurrentUser();
        console.log("Logged in user via Google:", user);

        toast.success("Login successful!");
        navigate("/"); // redirect to home
      } catch (err) {
        console.error(err);
        toast.error("Google login failed");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
