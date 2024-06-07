const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  createProject,
  addUserToProject,
  removeUserFromProject,
  getProjectUsers,
  getProjectMessages,
  getAllProjects,
  getProjectsByCreator,
  getProjectsByUser,
} = require("../controllers/projectController");

const router = express.Router();

// Create a project
router.post("/projects", createProject);

// Add a user to a project by email
router.patch("/projects/:projectId/addUser", addUserToProject);

// Remove a user from a project by email
router.patch("/projects/:projectId/removeUser", removeUserFromProject);

// Get users of a project
router.get("/projects/:projectId/users", getProjectUsers);

// Get messages of a project
router.get("/projects/:projectId/messages", getProjectMessages);

// Get all projects
router.get("/projects", getAllProjects);

// Route to get projects associated with a user
router.get("/projects", verifyToken, getProjectsByUser);

module.exports = router;
