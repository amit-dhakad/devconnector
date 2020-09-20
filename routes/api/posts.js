const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

// validation
const validationPostInput = require('../../validation/post');
//@route GET api/posts/test
//@desc  Test post route
//@access public
router.use('/test', (req, res) => res.json({ msg: 'Post works' }));

// @route GET api/posts
// @desc Get posts
// @access Public

router.get('/', (req, res) => {
  Post.find()
    .sort({
      date: -1,
    })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostfound: 'No post Found' }));
});

// @route GET api/posts/:id
// @desc Get post by id
// @access Public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ nopostfound: 'No post found with that ID' });
      }
    })
    .catch((err) =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

// @route POST api/posts
// @desc Create post
// @access Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validationPostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then((post) => res.json(post));
  }
);

//   @route DELETE api/posts/:id
// @desc Delete post
// @access Private

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id).then((post) => {
        // Check for post Owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' });
        }

        // Delete
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch((err) =>
            req.status(404).json({ postnotfound: 'No post found' })
          );
      });
    });
  }
);
module.exports = router;
