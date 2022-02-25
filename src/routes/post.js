const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts');

router.get('/', PostsController.getAllPost);
router.get('/:id', PostsController.getPostById);
module.exports = router;
