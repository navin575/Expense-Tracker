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
app.use(
  cors({
    origin: function (origin, callback) {
      // 1. Allow local development or requests with no origin (like Postman or mobile apps)
      if (!origin || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }

      // 2. Allow ANY domain that ends with .vercel.app
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // 3. Otherwise, block it
      return callback(new Error("Not allowed by CORS"));
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
