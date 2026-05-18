const express = require("express");
const router = express.Router();
const taskCtrl = require("../controllers/task-crontoller");
const authMiddle = require("../middlewares/auth-middleware");

//POST /api/tasks
router.post("/", authMiddle, taskCtrl.createTask);

//GET /api/tasks
router.get("/", authMiddle, taskCtrl.getTasks);

//GET /api/tasks/:id
router.get("/:id", authMiddle, taskCtrl.getTasksById);

//PUT /api/tasks/:id
router.put("/:id", authMiddle, taskCtrl.updateTasks);

//DELETE /api/tasks/:id
router.delete("/:id", authMiddle, taskCtrl.deleteTask);

module.exports = router; 


