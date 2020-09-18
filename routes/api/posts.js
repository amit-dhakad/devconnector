const express = require('express');
const router = express.Router();

//@route GET api/posts/test
//@desc  Test post route
//@access public
router.use('/test', (req, res) => res.json({ msg: 'Post works' }));

module.exports = router;
