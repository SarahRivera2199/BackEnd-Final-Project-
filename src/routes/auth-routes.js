//IMPORT DEPENDENCIES
const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth-controller");

//REGISTER ROUTE
router.post("/register", authCtrl.register);

//LOGIN ROUTE
router.post("/login", authCtrl.login);

module.exports = router;
