var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Do api calls here</h1>");
});

const blogRouter = require("./blog");
router.use("/blog", blogRouter);

const careerRouter = require("./career");
router.use("/career", careerRouter);

const skillRouter = require("./skill");
router.use("/skill", skillRouter);

const categoryRouter = require("./category");
router.use("/category", categoryRouter);

module.exports = router;
