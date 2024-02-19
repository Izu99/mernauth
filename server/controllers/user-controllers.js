const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = 'MyToken';

// User signup
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists! Login Instead" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// User login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found. Signup Please" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Email / Password" });
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, { expiresIn: "35s" });

    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.user = decodedToken;
    next();
  });
};

// Retrieve user details
const getUser = async (req, res, next) => {
  const userId = req.user.id; // Access userId from the decoded token
  try {
    const user = await User.findById(userId, "-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Refresh token (if needed)
const refreshToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    const newToken = jwt.sign({ id: decodedToken.id }, JWT_SECRET_KEY, {
      expiresIn: "35s", // Refresh token with 1 hour expiration
    });

    // Set the new token in the response cookies
    res.cookie("token", newToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30000), // 1 hour in milliseconds
    });

    next();
  });
};

// Logout
const logout = (req, res, next) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { signup, login, verifyToken, getUser, refreshToken, logout };
