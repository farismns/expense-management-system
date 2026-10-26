import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
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

const sendPasswordReset = async (email) => {
  if (typeof email !== "string" || !email.trim()) return;
  const user = await usersRepository.findByEmail(email.trim().toLowerCase());
  if (!user) return;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.FRONTEND_APP_URL) {
    throw Object.assign(new Error("Password reset email is not configured"), { status: 503 });
  }
  const token = jwt.sign({ sub: String(user.id), purpose: "password-reset" }, `${process.env.JWT_SECRET}:${user.password}`, { expiresIn: "15m" });
  const resetUrl = `${process.env.FRONTEND_APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
  await transporter.sendMail({ from: process.env.GMAIL_USER, to: user.email, subject: "Reset your Expense Manager password", text: `Use this link within 15 minutes to reset your password: ${resetUrl}` });
};

const resetPassword = async (token, password) => {
  if (typeof token !== "string" || !token || typeof password !== "string" || password.length < 8) throw Object.assign(new Error("A valid token and a password of at least 8 characters are required"), { status: 400 });
  const unverified = jwt.decode(token);
  if (!unverified?.sub || unverified.purpose !== "password-reset") throw Object.assign(new Error("Invalid or expired reset link"), { status: 400 });
  const user = await usersRepository.findByIdWithPassword(Number(unverified.sub));
  if (!user) throw Object.assign(new Error("Invalid or expired reset link"), { status: 400 });
  try { jwt.verify(token, `${process.env.JWT_SECRET}:${user.password}`); } catch { throw Object.assign(new Error("Invalid or expired reset link"), { status: 400 }); }
  await usersRepository.updatePasswordById(user.id, await bcrypt.hash(password, 12));
};

export default {
  registerUser,
  authenticateUser,
  sendPasswordReset,
  resetPassword,
};
