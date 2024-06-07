const express = require("express");
const {
  createTask,
  updateTaskStatus,
  addCommentToTask,
  getTaskMessages,
  addUserToTask,
  removeUserFromTask,
} = require("../controllers/taskController");

const router = express.Router();

// Create a task
router.post("/project/:projectId/tasks", createTask);

// Update task status
router.patch("/tasks/:taskId/status", updateTaskStatus);

// Add a comment to a task
router.post("/tasks/:taskId/comments", addCommentToTask);

// Get task messages
router.get("/tasks/:taskId/messages", getTaskMessages);

// Add a user to a task by email
router.patch("/tasks/:taskId/addUser", addUserToTask);

// Remove a user from a task by email
router.patch("/tasks/:taskId/removeUser", removeUserFromTask);

module.exports = router;
