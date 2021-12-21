const router = require('express').Router();

const { User, Post, Comment } = require('../../models');

// get all posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
      // Query configuration
      attributes: ['id', 
                   'post_text',
                   'title',
                   'created_at'
                ],
      // show latest news first
      order: [['created_at', 'DESC']],
      // JOIN to the User table
      include: [
          // comment model -- attaches username to comment 
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          },
      ]
    }) 
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
  
});


// CREATE a new post
router.post('/',  (req, res) => {
    Post.create({ 
        title: req.body.title,
        post_text: req.body.post_text,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err); 
        });
});


module.exports = router;