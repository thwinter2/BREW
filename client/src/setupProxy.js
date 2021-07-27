const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/auth/", { target: "http://localhost:5000/" }));
  app.use(proxy("/api/", { target: "http://localhost:5000/" }));
  app.use(proxy("/profile/", { target: "http://localhost:5000/" }));
  app.use(proxy("/styles/", { target: "http://localhost:5000/" }));
  app.use(proxy("/categories/", { target: "http://localhost:5000/" }));
  app.use(proxy("/users/", { target: "http://localhost:5000/" }));
};
