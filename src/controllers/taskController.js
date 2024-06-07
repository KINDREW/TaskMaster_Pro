const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const createTask = async (req, res) => {
  const { name, description, assignedEmails } = req.body;
  const { projectId } = req.params;
  const creatorId = req.user._id;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send("Project not found");

    const assignedTo = await User.find({
      email: { $in: assignedEmails },
    }).select("_id");
    const assignedToIds = assignedTo.map((user) => user._id);

    const task = new Task({
      name,
      description,
      projectId: project._id,
      creatorId,
      assignedTo: assignedToIds,
    });
    await task.save();

    project.tasks.push(task._id);
    await project.save();

    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    task.status = status;
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

const addCommentToTask = async (req, res) => {
  const { text } = req.body;
  const { taskId } = req.params;
  const userId = req.user._id;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    const comment = { userId, text, createdAt: new Date() };
    task.comments.push(comment);
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getTaskMessages = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId).populate(
      "messages.userId",
      "username"
    );
    if (!task) return res.status(404).send("Task not found");

    res.status(200).send(task.messages);
  } catch (error) {
    res.status(400).send(error);
  }
};

const addUserToTask = async (req, res) => {
  const { userEmail } = req.body;
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    const user = await User.findOne({ email: userEmail }).select("_id");
    if (!user) return res.status(404).send("User not found");

    if (!task.assignedTo.includes(user._id)) {
      task.assignedTo.push(user._id);
      await task.save();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

const removeUserFromTask = async (req, res) => {
  const { userEmail } = req.body;
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    const user = await User.findOne({ email: userEmail }).select("_id");
    if (!user) return res.status(404).send("User not found");

    task.assignedTo = task.assignedTo.filter((id) => !id.equals(user._id));
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  createTask,
  updateTaskStatus,
  addCommentToTask,
  getTaskMessages,
  addUserToTask,
  removeUserFromTask,
};
