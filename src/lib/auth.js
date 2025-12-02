import jwt from "jsonwebtoken";

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function decodeToken(token) {
  try{
    return jwt.decode(token,process.env.JWT_SECRET);
  } catch(err){
    return null;
  }
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
