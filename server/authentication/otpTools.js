import { hash } from "bcrypt";
import PendingUser from "../schema/pendingUser.js";
import User from "../schema/user.js";
import sendOtp from "./sendOtp.js";

async function storeSendOtp(email, pass) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await PendingUser.findOneAndUpdate(
      { email: email },
      { otp: otp, createdAt: new Date(), password: pass },
      { upsert: true, new: true }
    );

    console.log(`OTP created and stored for: ${email}`);

    const sent = await sendOtp(email, otp);

    if (sent) {
      console.log("OTP sent successfully to email");
      return true;
    } else {
      console.error("Failed to send OTP email");
      return false;
    }
  } catch (error) {
    console.error("Error in storeSendOtp process: " + error);
    return false;
  }
}
async function verifyOtp(email, userOtp) {
  try {
    const record = await PendingUser.findOne({ email: email });

    if (!record) {
      console.log("No OTP record found for this email");
      return { success: false, message: "פג תוקף הקוד או שהמייל לא נמצא" };
    }

    if (record.otp === userOtp) {
      console.log("OTP verified successfully");

      await User.create({
        email: email,
        password: record.password,
      });

      await PendingUser.deleteOne({ email: email });
      return { success: true };
    } else {
      return { success: false, message: "קוד שגוי" };
    }
  } catch (error) {
    console.error("Error verifying OTP: " + error);
    return { success: false, message: "שגיאת שרת" };
  }
}
export { storeSendOtp, verifyOtp };
