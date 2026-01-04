import "./App.css";
import Welcome from "./Welcome";
import Login from "./Login";
import SignUp from "./SignUp";
import Otp from "./Otp";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/otp" element={<Otp />} />
      </Routes>
    </>
  );
}

export default App;
