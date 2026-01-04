import { useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

export default function Welcome() {
  const navigate = useNavigate();

  const [userEmail] = useState(() => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now();

      if (decoded.exp * 1000 < now) {
        localStorage.removeItem("token");
        navigate("/login");
        return null;
      }

      return decoded.email;
    } catch (err) {
      console.error("Token error", err);
      localStorage.removeItem("token");
      navigate("/login");
      return null;
    }
  });

  if (!userEmail) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px", direction: "rtl" }}>
      <h1>שלום וברכה, {userEmail}!</h1>
      <p>איזה כיף שחזרת אלינו.</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        התנתק
      </button>
    </div>
  );
}
