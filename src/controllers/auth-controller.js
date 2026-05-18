//IMPORT DEPENDENCIES
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const authService = require("../services/auth-service");


//VALIDATION HELPER 
const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

//USER REGISTRATION - POST /api/auth/register
exports.register = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    
    if (!isEmailValid(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    authService.register(email, password, (err, result) => {
        if (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Server error"
            });
        }
        return res.status(201).json({
            message: "User created"
        });
    });
};


//LOGIN - POST /api/auth/login
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    authService.login(email, password, (err, token) => {
        if (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Server error"
            });
        }
        return res.json({
            token: token
        });
    });
};
