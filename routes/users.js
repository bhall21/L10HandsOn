var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('../services/passport');
var authService = require('../services/auth');



router.get('/signup', function (req, res, next) {
  res.render('signup');
});
/*USER SIGNUP /users/signup */
router.post('/signup', function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password)
      }
    })
    .spread(function (result, created) {
      if (created) {
        res.redirect('login');
      } else {
        res.send('This user already exists');
      }
    });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username
    }
  }).then(user => {
    if (!user) {
      console.log('User not found')
      return res.status(401).json({
        message: "Login Failed"
      });
    } else {
      let passwordMatch = authService.comparePasswords(req.body.password, user.Password);
      if (passwordMatch) {
        let token = authService.signUser(user);
        res.cookie('jwt', token);
        if (user) {
          res.render('profile', {
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Username: user.Username,
          });
        }        
      } else {
        console.log('Wrong password');
        res.send('Wrong password');
      }
    }
  });
});

router.get('/profile', function (req, res, next) {
  let token = req.cookies.jwt;
  authService.verifyUser(token)
    .then(user => {
      if (user) {
        res.send(JSON.stringify(user));
      } else {
        res.status(401);
        res.send('Must be logged in');
      }
    })
});

router.get('/:id', function (req, res, next) {
  if (req.user && req.user.Admin) {
    models.users.findOne({
      where: { UserId: parseInt(req.params.id) }
    })
      .then(user => {
        if (user) {
          res.render('user', {
            users: user
          });
        } else {
          res.send('User not found');
        }
      });
  } else {
    res.send('unauthorized');
  }
});

router.put("/profile/:i", function(req, res) {
 let post = parseInt(req.params.id);

    models.posts.update(
      req.body, {
        where: {
        UserId: post
      }
      }).then(reult => 
        res.redirect('/profile/' + post))
        .catch(err => {
          res.status(400);
          res.send("There was a problem updating the actor.  Please check the actor information.");
        });
  });

module.exports = router;
