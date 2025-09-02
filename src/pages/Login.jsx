import React from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/api.js'
import { toast } from 'react-toastify';

const Login = () => {
   const [username, setUsername] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [loading, setLoading] = React.useState(false);
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Attempting login with:", { username, password: password.substring(0, 5) + "..." });
      
      const data = await login(username, password);
      
      console.log("Login response data:", data);
      
      if (data && data.token) {
        toast.success("Login successful!");
        
        // Debug: Check if token was stored
        setTimeout(() => {
          const storedToken = localStorage.getItem('authToken');
          console.log("Token stored in localStorage:", !!storedToken);
          if (storedToken) {
            console.log("Token preview:", storedToken.substring(0, 50) + "...");
          }
        }, 100);
        
        navigate('/');
      } else {
        console.error("Login response missing token:", data);
        toast.error("Invalid login response - no token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
   };

    return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          onClick={() => !loading && navigate("/signup")}
          className={`mt-4 text-sm text-blue-600 text-center ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:underline'}`}
        >
          Don't have an account? Sign up
        </p>
      </form>
    </div>
  );
};

export default Login;