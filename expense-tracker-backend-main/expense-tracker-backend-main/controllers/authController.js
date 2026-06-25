const User=require('../models/User');
const jwt =require("jsonwebtoken");

// //Generate JWT token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"});
};

//Register User
 exports.registerUser = async (req, res) => {
    console.log("req.body", req.body);
    console.log("req.file:", req.file);

    const fullName = req.body.fullName?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    let profileImageUrl;
    if (req.file) {
    profileImageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
  }


    try {
    const existingUser = await User.findOne({ email });
    console.log("Email:", email);
console.log("Existing User:", existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Server error, please try again later" });
    }
};

//Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

//Get User Info
exports.getUserInfo = async (req, res) => {
   try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
