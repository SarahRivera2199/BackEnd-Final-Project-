//IMPORT DEPENDENCIES 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

//USER REGISTRATION SERVICE - handles user registration
exports.register = async (email, password, callback) => {
    userModel.checkEmailExists(email, async (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) {
            return callback({ status: 400, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        userModel.createUser(email, hashedPass, callback);
    });
};

//USER LOGIN SERVICE - handles user authentication (login)
exports.login = (email, password, callback) => {
    userModel.findByEmail(email, async (err, results) => {
        if (err) return callback(err);

        if (results.length === 0) {
            return callback({ status: 401, message: "Invalid credentials" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return callback({ status: 401, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        callback(null, token);
    });
};

