const Project = require("./models/Project");
const Task = require("./models/Task");

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinProject", (projectId) => {
      socket.join(projectId);
      console.log(`User joined project room: ${projectId}`);
    });

    socket.on("sendProjectMessage", async ({ projectId, userId, text }) => {
      const project = await Project.findById(projectId);
      if (project) {
        const message = { userId, text, createdAt: new Date() };
        project.messages.push(message);
        await project.save();
        io.to(projectId).emit("receiveProjectMessage", message);
      }
    });

    socket.on("joinTask", (taskId) => {
      socket.join(taskId);
      console.log(`User joined task room: ${taskId}`);
    });

    socket.on("sendTaskMessage", async ({ taskId, userId, text }) => {
      const task = await Task.findById(taskId);
      if (task) {
        const message = { userId, text, createdAt: new Date() };
        task.messages.push(message);
        await task.save();
        io.to(taskId).emit("receiveTaskMessage", message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = { initializeSocket };
