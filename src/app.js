const express = require("express");
const cors = require("cors");

const userAuthRoutes = require("./routes/auth/userAuthRoutes");
const adminAuthRoutes = require("./routes/auth/adminAuthRoutes");
const businessAuthRoutes = require("./routes/auth/businessAuthRoutes");
const categoryRoutes = require("./routes/admin/categoryRoutes");
const propertyRoutes = require("./routes/business/propertyRoutes");


const app = express();

app.use(cors());
app.use(express.json());

// Auth Routes
app.use("/api/auth/user", userAuthRoutes);
app.use("/api/auth/admin", adminAuthRoutes);
app.use("/api/auth/business", businessAuthRoutes);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/property", propertyRoutes);
app.get('/', (req, res) => {
  res.send('BookFirst API is running 🚀');
});

module.exports = app;