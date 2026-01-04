import bcrypt from "bcrypt";

const saltRounds = 10;

async function encrypter(pass) {
  const hashedPassword = await bcrypt.hash(pass, saltRounds);
  return hashedPassword;
}

async function checker(pass, user) {
  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) {
    return false;
  }
  return true;
}

export { encrypter, checker };
