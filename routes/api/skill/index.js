var express = require("express");
var router = express.Router();
const getQuery = require("../../../db/getQuery");
router.get("/:category_id", async (req, res) => {
  try {
    const category_id = req.params.category_id;
    if (!category_id)
      return res
        .status(400)
        .json({ message: "send category_id in the params", success: false });
    const query = `select * from skill where category_id = ${category_id};`;
    const skills = await getQuery(query);
    if (skills.length === 0)
      return res.status(404).json({
        message: "No skills found in this category",
        skills,
        success: false,
      });
    return res.status(200).json({ skills, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err, success: false });
  }
});
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const name = body.name;
    const category_id = body.category_id;
    if (!(name && category_id))
      return res.status(400).json({
        message: "Send name of skill and category_id in the body",
        success: false,
      });
    const query = `insert into category set name = ${name} set categoty_id = ${category_id};`;
    const skill_id = (await getQuery(query)).insertId;
    return res
      .status(201)
      .json({ skill: { id: skill_id, name, category_id }, success: true });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
module.exports = router;
