var express = require("express");
var router = express.Router();
const getQuery = require("../../../db/getQuery");
router.get("/", async (req, res) => {
  try {
    const query = `select * from category;`;
    const categories = await getQuery(query);
    if (categories.length === 0)
      return res
        .status(404)
        .json({ message: "No categories found", categories, success: false });
    return res.status(200).json({ categories, success: true });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
router.put("/:category_id", async (req, res) => {
  try {
    const category_id = req.params.category_id;
    const name = req.body.name;
    if (!(category_id && name)) {
      return res.status(400).json({
        message: "Send category_id in the params, name in the body",
        success: false,
      });
    }
    const query = `update category set name = "${name}" where category_id = ${category_id};`;
    const data = await getQuery(query);
    return res.status(200).json({
      message: "Record updated",
      category: { name, category_id },
      success: false,
    });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const name = body.name;
    if (!name)
      return res
        .status(400)
        .json({ message: "Send name of category in the body", success: false });
    const query = `insert into category set name = "${name}";`;
    const category_id = (await getQuery(query)).insertId;
    return res
      .status(201)
      .json({ category: { category_id, name }, success: true });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
router.delete("/:category_id", async (req, res) => {
  try {
    const category_id = req.params.category_id;
    if (!category_id) {
      return res
        .status(400)
        .json({ message: "send category in the params", success: false });
    }
    const query = `delete from category where category_id = ${category_id};`;
    const data = await getQuery(query);
    return res
      .status(200)
      .json({ message: "category deleted", success: false });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
module.exports = router;
