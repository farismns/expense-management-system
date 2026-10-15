import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usersRepository from "../users/users.repository.js";

const registerUser = async ({ email, password, fullname }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFullname = fullname.trim();

  const existingUser = await usersRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  return usersRepository.create({
    email: normalizedEmail,
    password: hashedPassword,
    fullname: normalizedFullname,
  });
};

const authenticateUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await usersRepository.findByEmail(normalizedEmail);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    },
    token,
  };
};

export default {
  registerUser,
  authenticateUser,
};
