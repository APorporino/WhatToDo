const path = require("path");
const express = require("express");
require('dotenv').config();

require("./db/mongoose.js");
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");
const projectRouter = require("./routers/project.js");
const storyRouter = require("./routers/story.js");
const sprintRouter = require("./routers/sprint.js");
const backlogRouter = require("./routers/backlog.js");
const auth = require("./middleware/auth.js");

const app = express();

//automatically parses incoming json
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);
app.use(projectRouter);
app.use(storyRouter);
app.use(sprintRouter);
app.use(backlogRouter);

// FOR PRODUCTION USE
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "..", "frontend/build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend/build", "index.html"));
});

module.exports = app;
