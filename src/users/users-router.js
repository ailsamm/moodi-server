const path = require('path');
const express = require('express');
const xss = require('xss');
const usersService = require('./users-service');
const usersRouter = express.Router();
const jsonParser = express.json();

// protects user info against XSS attacks
const serializeUser = user => ({
  id: user.id,
  first_name: xss(user.first_name),
  last_name: xss(user.last_name),
  email: xss(user.email),
  password: user.password,
  ranking: xss(user.ranking)
});

usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    usersService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    const newUserInfo = { 
        first_name, 
        last_name, 
        email, 
        password,
        ranking: "Mood Newbie"
    };

    // check that all required fields are present
    for (const [key, value] of Object.entries({ first_name, last_name, email, password })) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    usersService.insertUser(
      req.app.get('db'),
      newUserInfo
    )
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUser(user))
      })
      .catch(next);
  })

  usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    // checks if requested user info exists
    usersService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  })
  .delete((req, res, next) => {
    usersService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    // updates only provided fields
    const { first_name, last_name, email, password, ranking } = req.body;
    const userToUpdate = { first_name, last_name, email, password, ranking };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain at least either 'first_name', 'last_name', 'email', 'password' or 'ranking'`
        }
      });

    usersService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next);
  })

module.exports = usersRouter;