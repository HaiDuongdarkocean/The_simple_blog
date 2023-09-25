const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
    res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
    const query = `
    SELECT posts.*, authors.name AS authorName FROM posts 
    INNER JOIN authors ON  posts.idAuthor = authors.idAuthor
    `;
    const [posts] = await db.query(query);
    res.render("posts-list", {posts: posts});
});

router.get("/new-post", async function (req, res) {
    const [authors] = await db.query("SELECT * FROM authors");
    res.render("create-post", { authors: authors });
});

router.post("/posts", async function (req, res) {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    "INSERT INTO posts (title, summary, body, idAuthor) VALUES (?)",
    [data]
  );
  res.redirect("/posts");
});

router.get('/posts/:id', async function(req, res) {
    const query = `
        SELECT  posts.*
                , authors.name AS authorName
                , authors.email AS authorEmail 
        FROM posts 
        INNER JOIN authors 
        ON  posts.idAuthor = authors.idAuthor
        WHERE posts.idPost = ?
    `
    const [posts] = await db.query(query, [req.params.id])

    if (!posts || posts.length === 0) {
        return res.status(404).render('404');
    }
    console.log(posts[0])

    const postData = {
        ...posts[0],
        date: posts[0].date.toISOString(),
        humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }),
    }

    res.render('post-detail', {post: postData});
});

module.exports = router;
