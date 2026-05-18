//LOAD ENVIRONMENT VARIABLES
require("dotenv").config();

//IMPORT DEPENDENCIES< ROUTES AND MIDDLEWARE
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth-routes");
const taskRoutes = require("./routes/task-routes");
const errMiddle = require("./middlewares/err-middleware");

//INITIALIZE APP
const app = express();

//GLOBAL MIDDLEWARE 
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//TEST ROUTE - check health 
app.get("/api/health", (req, res) => {
    res.json({status: "ok"});
});

//ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//GLOBAL ERROR HANDLER
app.use(errMiddle);

//START SERVER 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
