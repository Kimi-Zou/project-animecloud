// External dependencies
const express = require('express');
const router = express.Router();

// Internal dependencies
const apiRouter = require('./api');

//------------------ Moute routes -------------------
router.use('/api', apiRouter);

//------------------- Restore csrf Token fot both development and production ------------------
// 1. Serve React build files in production
if (process.env.NODE_ENV === "production") {
  const path = require('path');

  // Serve the frontend's index.html file at the root route
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "build", "index.html")
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });
};

 // 2. Add a XSRF-TOKEN cookie in development
 if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.status(201).json({});
  });
};

module.exports = router;