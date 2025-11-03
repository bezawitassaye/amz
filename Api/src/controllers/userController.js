import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../config/db.js"; // your PostgreSQL pool connection

const JWT_SECRET = "your_jwt_secret_key"; // better to store in .env

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    // Check if user exists
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ success: false, message: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email",
      [full_name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    delete user.password;

    res.json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    // If you store tokens on the client (localStorage/cookies), just clear it on the frontend.
    // On the server, you can optionally add token invalidation logic here (e.g. blacklist).
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Optionally store invalidated token in a blacklist table (advanced version)
    // await pool.query("INSERT INTO token_blacklist (token) VALUES ($1)", [token]);

    res.json({ success: true, message: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
