import jwt from "jsonwebtoken";

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m", // 15 mins short-lived access
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // 7 days long-lived refresh
  });
};

// Kept for backward compatibility with existing code
const generateToken = (id) => {
  return generateAccessToken(id);
};

export default generateToken;