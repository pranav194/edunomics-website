var express = require("express");
var router = express.Router();
const getQuery = require("../../../db/getQuery");
router.get("/", async (req, res) => {
  try {
    const query = `select * from skill;`;
    const skills = await getQuery(query);
    if (skills.length === 0)
      return res.status(404).json({
        message: "No skills",
        skills,
        success: false,
      });
    return res.status(200).json({ skills, success: true });
  } catch (err) {
    console.log(err);
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
    const query = `insert into skill set name = "${name}", category_id = ${category_id};`;
    const skill_id = (await getQuery(query)).insertId;
    return res
      .status(201)
      .json({ skill: { id: skill_id, name, category_id }, success: true });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
router.delete("/:skill_id", async (req, res) => {
  try {
    const skill_id = req.params.skill_id;
    if (!skill_id) {
      return res
        .status(400)
        .json({ message: "send skill in the params", success: false });
    }
    const query = `delete from skill where skill_id = ${skill_id};`;
    const data = await getQuery(query);
    return res
      .status(200)
      .json({ message: "skill deleted", success: true, data });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
router.put("/:skill_id", async (req, res) => {
  try {
    const skill_id = req.params.skill_id;
    const name = req.body.name;
    const category_id = req.body.category_id;
    if (!(skill_id && name)) {
      return res.status(400).json({
        message:
          "Send skill_id in the params, name in the body and category_id in the body",
        success: false,
      });
    }
    const query = `update skill set name = "${name}", category_id = ${category_id}
     where skill_id = ${skill_id};`;
    const data = await getQuery(query);
    return res.status(200).json({
      message: "Record updated",
      skill: { name, skill_id, category_id },
      data,
      success: false,
    });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
module.exports = router;
