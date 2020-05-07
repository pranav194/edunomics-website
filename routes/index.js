var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
const apiRouter = require("./api");
router.use("/api", apiRouter);

module.exports = router;
