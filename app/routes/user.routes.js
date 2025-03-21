const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post(
    "/api/share/create",
    [authJwt.verifyToken],
    controller.createSharing
  );

  app.post(
    "/api/share/sharing/:id/update",
    [authJwt.verifyToken],
    controller.updateSharing
  );

  app.get(
    "/api/share/sharing/:id",
    [authJwt.verifyToken],
    controller.getOneSharing
  );

  app.get(
    "/api/share/sharings",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.getAllSharings
  );

  app.get(
    "/api/share/titles",
    controller.getAllTitles
  );
};
