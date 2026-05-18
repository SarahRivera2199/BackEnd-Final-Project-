//IMPORT DEPENDENCIES
const db = require("../config/db");

//CREATE TASK
exports.createTask = (data, callback) => {
    const sql = `INSERT INTO tasks 
    (title, task_description, task_status, due_date, user_id) VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, data, callback);
};

//GET TASK - get tasks with filters
exports.getTasks = (sql, params, callback) => {
    db.query(sql, params, callback);
};

//GET TASK - get single task 
exports.getTaskById = (taskId, userId, callback) => {
    const sql = "SELECT * FROM tasks WHERE id = ? AND user_id = ?";
    db.query(sql, [taskId, userId], callback);
};

//UPDATE TASK
exports.updateTask = (data, callback) => {
    const sql = `
    UPDATE tasks SET 
        title = COALESCE(?, title),
        task_description = COALESCE(?, task_description),
        task_status = COALESCE(?, task_status),
        due_date = COALESCE(?, due_date)
    WHERE id = ? AND user_id = ?
    `;

    db.query(sql, data, callback);
};

//ELIMINATE TASK
exports.deleteTask = (taskId, userId, callback) => {
    const sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
    db.query(sql, [taskId, userId], callback);
};
