import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5220/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/welcome", { state: { email } });
      } else if (response.status === 405) {
        const wantRegister = window.confirm(
          "האימייל לא קיים במערכת. האם תרצה להירשם?"
        );

        if (wantRegister) {
          const regResponse = await fetch("http://localhost:5220/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (regResponse.ok) {
            navigate("/otp", { state: { email } });
          } else {
            setError("שגיאה בתהליך ההרשמה");
          }
        }
      } else {
        setError("שם משתמש או סיסמה שגויים");
      }
    } catch (err) {
      setError("שגיאת תקשורת עם השרת");
      console.error(err);
    }
  };

  return (
    <div
      style={{ maxWidth: "300px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="8"
          required
        />
        <br />
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">התחבר</button>
      </form>
    </div>
  );
}
