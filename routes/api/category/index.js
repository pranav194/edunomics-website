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
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const name = body.name;
    if (!name)
      return res
        .status(400)
        .json({ message: "Send name of category in the body", success: false });
    const query = `insert into category set name = ${name};`;
    const category_id = (await getQuery(query)).insertId;
    return res
      .status(201)
      .json({ category: { category_id, name }, success: true });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
module.exports = router;
