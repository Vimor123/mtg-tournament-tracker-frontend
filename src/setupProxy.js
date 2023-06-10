const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://mtg-tournament-tracker-backend.onrender.com",
      changeOrigin: true,
    })
  );
};