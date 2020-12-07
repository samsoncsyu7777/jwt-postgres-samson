const authJwt = require("../middleware/authJwt");
const verifySignUp = require("../middleware/verifySignUp");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkPasswordLength
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/enableuser", 
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.enableUser
  );

  app.post("/api/auth/changepassword", 
  [authJwt.verifyToken, verifySignUp.checkPasswordLength],
  controller.changePassword
  );

  app.post("/api/auth/updateuser", 
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.updateUser
  );

  app.get("/api/auth/users", 
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getAllUsers
  );

  app.get("/api/auth/users/:id", 
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getOneUser
  );
};

