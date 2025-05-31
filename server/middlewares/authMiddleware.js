import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization; // Lowercase header check first

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    console.log("The decoded user:", req.user);
    next();
  } catch (error) {
    return res.status(400).json({ message: "Token is not valid", success: false });
  }
};

export default verifyToken;
