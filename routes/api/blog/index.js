var express = require("express");
var router = express.Router();
const getQuery = require("../../../db/getQuery");

router.get("/:category_id", async (req, res) => {
  try {
    const category_id = req.params.category_id;
    if (!category_id)
      return res
        .status(400)
        .json({ message: "Send category id in the params", success: false });
    const query = `select * from blog where category_id = ${category_id};`;
    const blogs = await getQuery(query);
    if (blogs.length === 0)
      return res
        .status(404)
        .json({ message: "No blogs in this category", success: false });
    const blogsData = await Promise.all(
      blogs.map(async (blogObj) => ({
        ...blogObj,
        videos: await getQuery(
          `select * from video where blog_id = ${blogObj.blog_id};`
        ),
      }))
    );
    return res.status(200).json({ blogs: blogsData, success: true });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const blog = body.blog;
    const title = body.title;
    const category_id = body.category_id;
    const slide_url = body.slide_url || "";
    const subtitle = body.subtitle || "";
    if (!(category_id && blog && title))
      return res.status(400).json({
        message: "Send blog , category_id and title in the body",
        success: false,
      });
    let query = `insert into blog set blog = ${blog}, title = ${title}, 
      slide_url = ${slide_url}, category_id = ${category_id}, subtitle = ${subtitle};`;
    const blog_id = (await getQuery(query)).insertId;
    return res.status(201).send({
      blog: { blog, title, blog_id, slide_url, category_id, subtitle },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});
module.exports = router;
