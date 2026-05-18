//IMPORT DEPENDENCIES
const taskService = require("../services/task-service");

//CREATE TASK
exports.createTask = (req, res) => {
    const userId = req.user.id;
    
    taskService.createTask(req.body, userId, (err, result) => {
        if (err) {
            return res.status(err.status || 500).json({
                message: err.message
            });
        }
        return res.status(201).json({
            message: "Task created successfully",
            taskId: result.insertId
        });
    });

};

//GET TASKS
exports.getTasks = (req, res) => {
    const userId = req.user.id; 
    const filters = {
        status: req.query.status,
        date: req.query.date
    }
    taskService.getTasks(userId, filters, (err, result) => {

        if (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Error fetching tasks"
            });
        }
        return res.json(result);
    });
};

//GET TASKS BY ID
exports.getTasksById = (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    taskService.getTaskById(taskId, userId, (err, task) => {
        if (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Error fetching task"
            });
        }
        return res.json(task);
    });
};

//UPDATE TASKS
exports.updateTasks = (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    taskService.updateTask(taskId, userId, req.body, (err, result) => {
        if (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Error updating task"
            });
        }
        return res.json(result);
    }); 
};

//ELIMINATE TASKS
exports.deleteTask = (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    taskService.deleteTask(taskId, userId, (err, result) => {

        if (err) {
            return res.status(err.status || 500).json({
                message: err.message || "Error deleting task"
            });
        }
        return res.json(result);
    });
};