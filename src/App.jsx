import { useState } from 'react';
import Home from './pages/Home';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div>
      <Home />
      <ToastContainer position="top-right" autoClose={3000} />
     </div>
    </>
  )
}

export default App
