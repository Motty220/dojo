import mongoose from "mongoose";
import User from "../schema/user.js";
import * as passTools from "../authentication/passwordTools.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
};

async function findUser(email) {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

async function checkUser(email, pass) {
  try {
    const user = await findUser(email);
    if (user) {
      const userCheck = await passTools.checker(pass, user);
      if (userCheck) {
        return { status: "success", user: user };
      } else {
        return { status: "invalid_password" };
      }
    } else {
      return { status: "not_found" };
    }
  } catch (error) {
    console.log(error);
  }
}

export { checkUser, connectDB };
