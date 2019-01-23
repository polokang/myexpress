const express = require("express");
const packageRoutes = require("./routes/package");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("welcome");
});

router.use("/api", packageRoutes);

module.exports = router;
