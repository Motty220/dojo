import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { storeSendOtp, verifyOtp } from "./authentication/otpTools.js";
import { checkUser, connectDB } from "./db/db.js";
import { encrypter, checker } from "./authentication/passwordTools.js";

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "נא להזין אימייל וסיסמה" });
    }

    const result = await checkUser(email, password);

    if (result.status === "not_found") {
      return res.status(405).json({ error: "user_not_found" });
    }

    if (result.status === "invalid_password") {
      return res.status(401).json({ error: "invalid_password" });
    }

    if (result.status === "success") {
      const token = jwt.sign(
        { email: result.user.email, id: result.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );

      return res.status(200).json({
        message: "Login success",
        token: token,
      });
    }

    return res.status(401).send();
  } catch (error) {
    console.error("Login Route Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "נתונים חסרים" });
    }

    const verification = await verifyOtp(email, otp);

    if (verification.success) {
      const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });

      return res.status(200).json({
        message: "התחברת בהצלחה",
        token: token,
      });
    } else {
      return res.status(400).json({ error: verification.message });
    }
  } catch (error) {
    console.error("OTP Route Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "נא להזין אימייל וסיסמה" });
    }

    console.log(`New Registration attempt for: ${email}`);

    const hashedPassword = await encrypter(password);

    const success = await storeSendOtp(email, hashedPassword);

    if (success) {
      res.status(201).json({ message: "קוד אימות נשלח לאימייל" });
    } else {
      res.status(500).json({ error: "שגיאה בשליחת קוד האימות" });
    }
  } catch (error) {
    console.error("Register Route Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
