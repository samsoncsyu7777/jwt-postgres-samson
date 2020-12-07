/*
import { user as _user, role, Sequelize } from "../models";
import { secret } from "../config/auth.config";
const User = _user;
const Role = role;

const Op = Sequelize.Op;

import { sign } from "jsonwebtoken";
import { hashSync, compareSync } from "bcryptjs";

export function signup(req, res) {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

export function signin(req, res) {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = sign({ id: user.id }, secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}
*/

const db = require("../models/index");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    enabled: false
  })
    .then(user => {
      console.log("user:")
      console.log(user);
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          console.log("roles:")
          console.log(roles);
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateUser = (req, res) => {
  User.findByPk(req.body.id)
    .then(user => {
      user.username = req.body.username;
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password, 8);
      user.enabled = req.body.enabled;
      User.update(user.dataValues,
        { where: { id: req.body.id } })
        .then(() => {
          if (req.body.roles) {
            Role.findAll({
              where: {
                name: {
                  [Op.or]: req.body.roles
                }
              }
            }).then(roles => {
              user.setRoles(roles).then(() => {
                res.send({ message: "User was updated successfully!" });
              });
            });
          } else {
            // user role = 1
            user.setRoles([1]).then(() => {
              res.send({ message: "User was updated successfully!" });
            });
          }
        });//
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        if (user.enabled) {
          res.cookie('jwt', token, { maxAge: 900000, httpOnly: true });
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          enabled: user.enabled,
          roles: authorities//,          
          //accessToken: user.enabled ? token : ""
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.enableUser = (req, res) => {
  //Enable new user
  User.findByPk(req.body.id)
    /*
    User.findOne({
      where: {
        id: req.body.id
      }
    })
    */
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.enabled = true;
      User.update(
        /*
        {username: user.username,
        email: user.email,
        password: user.password,
        enabled: true},
        */
        user.dataValues, //user's new values
        { where: { id: req.body.id } }
      ).then(() => {
        res.send({ message: "User was enabled successfully!" });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
}

exports.changePassword = (req, res) => {
  User.findByPk(req.userId)
    .then(user => {
      console.log(user.dataValues.password);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.oldpassword,
        user.password
      );
      if (passwordIsValid) {
        user.password = bcrypt.hashSync(req.body.password, 8)
        User.update(
          user.dataValues,
          { where: { id: req.userId } }
        ).then(() => {
          res.send({ message: "Password was changed successfully!" });
        });
      }
      else {
        return res.status(403).send({ message: "Invalid old password!" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    })
}

exports.getAllUsers = (req, res) => {
  var sortArray = ["username", "asc"];
  if (req.query.sort) {
    sortArray = req.query.sort.split(":");
  }
  User.findAndCountAll({
    offset: req.query.page ? req.query.page * req.query.limit : 0,
    limit: req.query.limit ? req.query.limit : 100,
    where: {
      username: {
        [Op.like]: '%' + (req.query.search ? req.query.search : "") + '%'
      }
    },
    order: [
      [sortArray[0], sortArray[1]]
    ]
  })
    .then(users => {
      res.send({ users: users });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.getOneUser = (req, res) => {
  User.findByPk(req.params.id).then(user => {
    res.send({ user: user });
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}