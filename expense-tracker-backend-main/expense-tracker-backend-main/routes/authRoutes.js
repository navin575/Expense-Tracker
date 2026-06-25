const express = require("express");
const{ project } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const{
    registerUser,
    loginUser,
    getUserInfo,
}= require("../controllers/authController");
const router = express.Router();

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.get("/getUser",project, getUserInfo);

router.post("/upload-image", upload.single("profileImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;

