require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

connectDB();
// Dynamic CORS function to handle production, local development, and Vercel preview links
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedPatterns = [
        /^http:\/\/localhost:\d+$/,                          // Matches http://localhost:5173, etc.
        /^https:\/\/expense-trackez\.vercel\.app$/,          // Matches your main production URL
        /^https:\/\/expense-tracker-.*-navinmohan575-6079s-projects\.vercel\.app$/ // 🚀 Matches ALL your Vercel preview/deployment URLs
      ];

      const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);  


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send("Backend Server is Running Successfully!");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
