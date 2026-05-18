//IMPORT DEPENDENCIES
const db = require("../config/db");

//FIND USER BY EMAIL 
exports.findByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
};

//CHECK IF USER EXISTS
exports.checkEmailExists = (email, callback) => {
    const sql = "SELECT id FROM users WHERE email = ?";
    db.query(sql, [email], callback);
}

//CREATE NEW USER
exports.createUser = (email, hashedPassword, callback) => {
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(sql, [email, hashedPassword], callback);
}