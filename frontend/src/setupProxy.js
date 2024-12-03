const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    [
      "/currentUser",
      "/users/*",
      "/newuser",
      "/project/*",
      "/project",
      "/user",
      "/backlog/*",
      "/story",
      "/story/*",
      "/tasks",
      "/sprint",
    ],
    createProxyMiddleware({
      target: "http://localhost:8080",
    })
  );
};
