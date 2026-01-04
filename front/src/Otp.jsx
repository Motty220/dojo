import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  const sendOtp = async () => {
    if (otp.length < 4) {
      setError("נא להזין קוד מלא");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5220/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/welcome");
      } else {
        setError(data.message || "הקוד שהוזן אינו תקין");
      }
    } catch (err) {
      setError("שגיאת תקשורת עם השרת");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        textAlign: "center",
        direction: "rtl",
      }}
    >
      <h3>אימות חשבון</h3>
      <p>
        שלחנו קוד אימות לכתובת: <br />
        <strong>{email}</strong>
      </p>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="הכנס קוד"
          style={{
            fontSize: "24px",
            textAlign: "center",
            letterSpacing: "5px",
            padding: "10px",
            width: "150px",
          }}
        />
      </div>

      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

      <button
        onClick={sendOtp}
        disabled={loading || otp.length === 0}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "מאמת..." : "אמת קוד"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          חזרה לדף ההתחברות
        </button>
      </div>
    </div>
  );
}
