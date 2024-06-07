const Project = require("../models/Project");

const createProject = async (req, res) => {
  const { name, description, useremails, startDate, endDate } = req.body;
  const creatorId = req.user._id;

  try {
    const project = new Project({
      name,
      description,
      creatorId,
      useremails,
      startDate,
      endDate,
    });
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
};

const addUserToProject = async (req, res) => {
  const { userEmail } = req.body;
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send("Project not found");
    if (!project.useremails.includes(userEmail)) {
      project.useremails.push(userEmail);
      await project.save();
    }
    res.status(200).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
};

const removeUserFromProject = async (req, res) => {
  const { userEmail } = req.body;
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send("Project not found");
    project.useremails = project.useremails.filter(
      (email) => email !== userEmail
    );
    await project.save();
    res.status(200).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getProjectUsers = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send("Project not found");
    res.status(200).send(project.useremails);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getProjectMessages = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).populate(
      "messages.userId",
      "username"
    );
    if (!project) return res.status(404).send("Project not found");

    res.status(200).send(project.messages);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).send(projects);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getProjectsByUser = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("Token not provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const projects = await Project.find({ useremails: user.email });
    if (!projects.length)
      return res.status(404).send("No projects found for this user");

    res.status(200).send(projects);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  createProject,
  addUserToProject,
  removeUserFromProject,
  getProjectUsers,
  getProjectMessages,
  getProjectsByUser,
  getAllProjects,
};
