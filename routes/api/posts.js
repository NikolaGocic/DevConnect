const express = require("express");
const mongoose = require("mongoose");
const request = require("request");
const config = require("config");
const Profile = require("../../model/Profile");
const User = require("../../model/User");
const Post = require("../../model/Post");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

//@route POST api/posts
//@desc create a post
router.post(
     "/",
     [
          auth,
          [
               check("text", "Post text is required")
                    .not()
                    .isEmpty()
          ]
     ],
     async (req, res) => {
          try {
               const errors = validationResult(req);
               if (!errors.isEmpty()) {
                    return res.status(400).json(errors.array());
               }

               const text = req.body.text;
               const user = await User.findOne({ _id: req.user.id });

               const postFields = {
                    user: req.user.id,
                    text,
                    name: user.name,
                    avatar: user.avatar
               };

               const post = Post(postFields);
               await post.save();

               res.json(post);
          } catch (error) {
               console.error(error.message);
               res.status(500).send("Server error");
          }
     }
);

//@route GET /api/posts/
//@desc get all posts
router.get("/", auth, async (req, res) => {
     try {
          const posts = await Post.find().sort({ date: -1 });
          res.json(posts);
     } catch (error) {
          console.error(error.message);
          res.status(500).send("Server error");
     }
});

//@route GET /api/posts/
//@desc get post by id
router.get("/:post_id", auth, async (req, res) => {
     try {
          const post = await Post.findOne({ _id: req.params.post_id });
          if (!post) return res.send("Post not found");
          else return res.json(post);
     } catch (error) {
          console.error(error.message);
          res.status(500).send("Server error");
     }
});

router.delete("/:post_id", auth, async (req, res) => {
     try {
          const post = await Post.findOne({ _id: req.params.post_id });
          if (post.user == req.user.id) {
               await Post.findOneAndRemove({ _id: req.params.post_id });
               return res.send("Post suc deleted");
          }
          res.send("Unauth user for deleting this post");
     } catch (error) {
          console.error(error.message);
          res.status(500).send("Server error");
     }
});

//@route put /api/posts/like/:post_id
//@desc like post
router.put("/like/:post_id", auth, async (req, res) => {
     try {
          const post = await Post.findOne({ _id: req.params.post_id });

          if (!post) return res.send("Post dosent exist");
          if (
               post.like.filter(likes => likes.user.toString() === req.user.id)
                    .length > 0
          ) {
               const index = post.like
                    .map(likes => likes.user)
                    .indexOf(req.user.id);
               if (index != -1) post.like.splice(index, 1);
               await post.save();

               return res.json(post);
          }

          post.like.unshift({ user: req.user.id });
          await post.save();

          res.json(post);
     } catch (error) {
          console.error(error.message);
          res.status(500).send("Server error");
     }
});

//@route /comment
//@desc add comment
router.put(
     "/comment/:post_id",
     [
          auth,
          [
               check("text", "Text is required")
                    .not()
                    .isEmpty()
          ]
     ],
     async (req, res) => {
          try {
               const text = req.body.text;

               const userA = await User.findOne({ _id: req.user.id });
               const post = await Post.findOne({ _id: req.params.post_id });

               const fields = {
                    user: req.user.id,
                    text,
                    name: userA.name,
                    avatar: userA.avatar
               };

               post.comments.unshift(fields);
               await post.save();

               res.json(post);
          } catch (error) {
               console.error(error.message);
               res.status(500).send("Server error");
          }
     }
);

router.delete("/comment/del", auth, async (req, res) => {
     try {
          const comment_id = req.body.comment_id;
          const post_id = req.body.post_id;

          const post = await Post.findOne({ _id: post_id });

          const index = post.comments
               .map(likes => likes._id)
               .indexOf(comment_id);
          if (index != -1) post.comments.splice(index, 1);
          await post.save();

          return res.json(post);
     } catch (error) {
          console.error(error.message);
          res.status(500).send("Server error");
     }
});

module.exports = router;
