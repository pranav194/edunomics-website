var express = require("express");
var router = express.Router();
const getQuery = require("../../../db/getQuery");
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const name = body.name;
    const category_id = body.category_id;
    if (!(name && category_id))
      return res.status(400).json({
        message: "send career and category_id in the body",
        success: false,
      });
    const query = `insert into career set category_id = ${category_id} ,name = "${name}"`;
    const career_id = (await getQuery(query)).insertId;
    return res.status(201).json({
      message: "Career created",
      career: { career_id, name, category_id },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
router.get("/:category_id", async (req, res) => {
  try {
    const category_id = req.params.category_id;
    if (!category_id)
      return res
        .status(400)
        .json({ message: "send category_id in the params", success: false });
    const query = `select * from career where category_id = ${category_id};`;
    const careers = await getQuery(query);
    if (careers.length === 0)
      return res.status(404).json({
        message: "No careers found in this category",
        careers,
        success: false,
      });
    return res.status(200).json({ careers, success: true });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
module.exports = router;
