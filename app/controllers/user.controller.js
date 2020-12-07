const db = require("../models/index");
const Title = db.title;
const Sharing = db.sharing;
const User = db.user;
const Op = db.Sequelize.Op;

exports.allAccess = (req, res) => {
  res.status(200).send("You are a public user.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("You are our registered user.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("You are our administrator.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Your are our moderator.");
};

exports.createSharing = (req, res) => {
  // Save Sharing to Database
  Sharing.create({
    sharingstring: req.body.sharingstring,
    userId: req.userId
  })
    .then(sharing => {
      Title.create({
        titlestring: req.body.titlestring,
        sharingId: sharing.id
      })
    })
    .then(() => {
      res.send({ message: "Sharing and title were created successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.updateSharing = (req, res) => {
  // Get sharing by sharingId
  Sharing.findByPk(req.params.id)
    .then(sharing => {
      // Save Sharing to Database
      if (req.userId == sharing.userId) {
        Sharing.update({
          sharingstring: req.body.sharingstring,
          userId: req.userId,
        },
          { where: { id: req.body.id } }
        )
          .then(sharing => {
            console.log(sharing);
            Title.update({
              titlestring: req.body.titlestring,
              sharingId: sharing.id
            },
              { where: { sharingId: req.body.id } }
            )
          })
          .then(() => {
            res.send({ message: "Sharing and title were updated successfully!" });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      } else {
        res.status(403).send({
          message: "Unauthorized action!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.getOneSharing = (req, res) => {
  var isModerator = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          isModerator = true
        }
      }
    })
      .then(() => {
        Sharing.findByPk(req.params.id)
          .then(sharing => {
            if (req.userId == sharing.userId || isModerator) {
              res.send({ sharingstring: sharing.sharingstring });
            } else {
              res.status(403).send({
                message: "Unauthorized action!"
              });
            }
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      });
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.getAllSharings = (req, res) => {
  var sortArray = ["sharingstring", "asc"];
  if (req.query.sort) {
    sortArray = req.query.sort.split(":");
  }
  Sharing.findAndCountAll({
    offset: req.query.page ? req.query.page * req.query.limit: 0,
    limit: req.query.limit ? req.query.limit: 100,
    where: {
      sharingstring: {
        [Op.like]: '%' + (req.query.search ? req.query.search : "") + '%'
      }
    },
    order: [
      [sortArray[0], sortArray[1]]
    ]
  })
    .then(sharings => {
      res.send({ sharings: sharings });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.getAllTitles = (req, res) => {
  var sortArray = ["titlestring", "asc"];
  if (req.query.sort) {
    sortArray = req.query.sort.split(":");
  }
  Title.findAndCountAll({
    offset: req.query.page ? req.query.page * req.query.limit: 0,
    limit: req.query.limit ? req.query.limit: 100,
    where: {
      titlestring: {
        [Op.like]: '%' + (req.query.search ? req.query.search : "") + '%'
      }
    },
    order: [
      [sortArray[0], sortArray[1]]
    ]
  })
    .then(titles => {
      res.send({ titles: titles });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}