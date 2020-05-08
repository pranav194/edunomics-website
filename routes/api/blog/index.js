var express = require("express");
var router = express.Router();
const getQuery = require("../../../db/getQuery");

router.get("/", async (req, res) => {
  try {
    const query = `select * from blog;`;
    const blogs = await getQuery(query);
    if (blogs.length === 0)
      return res.status(404).json({ message: "No blogs", success: false });
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
    let videos = body.videos || [];
    if (!(category_id && blog && title))
      return res.status(400).json({
        message: "Send blog , category_id and title in the body",
        success: false,
      });
    let query = `insert into blog set blog = "${blog}", title = "${title}", 
      slide_url = "${slide_url}", category_id = ${category_id}, subtitle = "${subtitle}";`;
    const blog_id = (await getQuery(query)).insertId;
    const videosData = await Promise.all(
      videos.map((videoObj) =>
        getQuery(
          `insert into video set video_url = "${videoObj.video_url}", blog_id = ${blog_id};`
        )
      )
    );
    videos = videos.map((videoObj, ind) => ({
      ...videoObj,
      video_id: videosData[ind].insertId,
      blog_id,
    }));
    return res.status(201).send({
      blog: {
        blog,
        title,
        blog_id,
        slide_url,
        category_id,
        subtitle,
        videos,
      },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});

router.delete("/:blog_id", async (req, res) => {
  try {
    const blog_id = req.params.blog_id;
    let query = [
      `delete from video where blog_id = ${blog_id};`,
      `delete from blog where blog_id = ${blog_id};`,
    ].join("");
    const data = await getQuery(query);
    res.status(200).json({ message: "blog deleted", success: true, data });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});

router.put("/:blog_id", async (req, res) => {
  try {
    const body = req.body;
    const blog = body.blog;
    const title = body.title;
    const blog_id = req.params.blog_id;
    const category_id = body.category_id;
    const slide_url = body.slide_url || "";
    const subtitle = body.subtitle || "";
    const videos = body.videos || [];
    if (!blog_id)
      return res
        .status(400)
        .json({ message: "send blog_id in the params", success: false });
    if (!(category_id && blog && title))
      return res.status(400).json({
        message: "Send blog , category_id and title in the body",
        success: false,
      });
    let query = `update blog set blog = "${blog}", title = "${title}",
     slide_url = "${slide_url}", category_id = ${category_id}, subtitle = "${subtitle}";`;
    let data = await getQuery(query);
    query = `select video_id from video where blog_id = ${blog_id};`;
    const uploadedvideo_ids = (await getQuery(query)).map(
      (videoObj) => videoObj.video_id
    );
    let newVideos = [];
    let updateVideoQuery = await Promise.all(
      uploadedvideo_ids.map((id, ind) => {
        if (videos[ind]) {
          newVideos.push({ video_url: videos[ind].video_url, video_id: id });
          return getQuery(
            `update video set video_url = "${videos[ind].video_url}" where video_id = ${id};`
          );
        } else return null;
      })
    );
    if (uploadedvideo_ids.length < videos.length) {
      const to_be_uploaded_video = videos.slice(uploadedvideo_ids.length);
      const updateVideo = await Promise.all(
        to_be_uploaded_video.map((video) =>
          getQuery(
            `insert into video set video_url = "${video.video_url}", blog_id = ${blog_id};`
          )
        )
      );
      newVideos = [
        ...newVideos,
        ...updateVideo.map((videoObj, ind) => ({
          video_id: videoObj.insertId,
          video_url: to_be_uploaded_video[ind].video_url,
        })),
      ];
    }
    if (videos.length < uploadedvideo_ids.length) {
      const delete_video_ids = uploadedvideo_ids.slice(videos.length);
      await Promise.all(
        delete_video_ids.map((id) =>
          getQuery(`delete from video where video_id = ${id};`)
        )
      );
    }
    return res.status(200).send({
      blog: {
        blog,
        title,
        blog_id,
        slide_url,
        category_id,
        subtitle,
        videos: newVideos,
      },
      success: true,
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err, success: false });
  }
});

module.exports = router;
