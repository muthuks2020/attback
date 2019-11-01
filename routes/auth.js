const express = require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const validateLoginInput = require('../validation/login')
const validateRegisterInput = require('../validation/register')
const { User } = require("../models");



// @route POST api/login
// @desc Login user and return JWT token
// @access Public
Router.route("/login").post(async (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const { email, password } = req.body;
  
    // Find user by email
    User.findOne({
      where: {
        email
      }
    }).then(user => {
      // Check if user exists
  
      if (!user) {
        return res.status(400).json({ emailNotFound: "Email is not registered" });
      }
  
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });
  

  // create a user
  Router.route("/register").post(async (req, res) => {
    console.log("------req.body-----", req.body);
  
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const { name, email, password } = req.body;
  
    User.findOne({
      where: {
        email
      }
    }).then(user => {
      if (user) {
        return res.status(400).json({
          email: "Email already exists"
        });
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password
        });
  
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // console.log("-------newuser-------", newUser)
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  });
  
  // get all users
  Router.route("getUsers").get(async (req, res) => {
    User.findAll().then(users => res.json(users));
  });
  

  module.exports = Router