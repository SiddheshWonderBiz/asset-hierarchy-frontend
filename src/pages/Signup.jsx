import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../utils/api.js'
import { toast } from 'react-toastify';


const Signup = () => {
   const [username , setUsername] = React.useState('');
   const [password , setPassword] = React.useState('');
   const navigate = useNavigate();

   const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
        await signup(username, password);
            toast.success("Signup successful. Please login.");
            navigate('/login');
    }catch(error){
      toast.error(error?.message || "Login failed");
    }
   }
    return (<div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Sign Up
        </button>

        <p
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-blue-600 cursor-pointer text-center"
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );

}

export default Signup;