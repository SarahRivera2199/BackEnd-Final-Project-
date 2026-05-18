//IMPORT DEPENDENCIES
const taskModel = require("../models/task-model");

//CREATE TASK
exports.createTask = (data, userId, callback) => {
    if (!data.title) {
        return callback({ status: 400, message: "Title required" });
    }

    const taskData = [
        data.title,
        data.description || null,
        data.status || "pending",
        data.due_date || null,
        userId
    ];

    taskModel.createTask(taskData, callback);
};

//GET TASK 
exports.getTasks = (userId, filters, callback) => {
    const { status, date } = filters;
    let sql = "SELECT * FROM tasks WHERE user_id = ?";
    const params = [userId];

    if (status) {
        if (!["pending", "in_progress", "done"].includes(status)) {
            return callback({ status: 400, message: "Invalid task status" });
        }

        sql += " AND task_status = ?";
        params.push(status);
    }

    if (date) {
        sql += " AND DATE(due_date) = ?";
        params.push(date);
    }

    taskModel.getTasks(sql, params, callback);
};

//GET TASK BY ID
exports.getTaskById = (taskId, userId, callback) => {
    if (!taskId) {
        return callback({ status: 400, message: "Task ID is required" });
    }

    taskModel.getTaskById(taskId, userId, (err, result) => {

        if (err) {
            return callback(err);
        }

        if (result.length === 0) {
            return callback({ status: 404, message: "Task not found" });
        }
        callback(null, result[0]);
    });
};

//UPDATE TASK
exports.updateTask = (taskId, userId, data, callback) => {
    const { title, description, status, due_date } = data;

    if (!title && !description && !status && !due_date) {
        return callback({
            status: 400,
            message: "At least one field must be provided to update"
        });
    }

    if (status && !["pending", "in_progress", "done"].includes(status)) {
        return callback({
            status: 400,
            message: "Invalid task status"
        });
    }

    const taskData = [
        title || null,
        description || null,
        status || null,
        due_date || null,
        taskId,
        userId
    ];

    taskModel.updateTask(taskData, (err, result) => {

        if (err) {
            return callback(err);
        }

        if (result.affectedRows === 0) {
            return callback({
                status: 404,
                message: "Task not found"
            });
        }

        callback(null, {
            message: "Task updated successfully"
        });
    });
};

//DELETE TASK
exports.deleteTask = (taskId, userId, callback) => {
    if (!taskId) {
        return callback({
            status: 400,
            message: "Task ID is required"
        });
    }

    taskModel.deleteTask(taskId, userId, (err, result) => {

        if (err) {
            return callback(err);
        }

        if (result.affectedRows === 0) {
            return callback({
                status: 404,
                message: "Task not found"
            });
        }

        callback(null, {
            message: "Task deleted successfully"
        });
    });
};
