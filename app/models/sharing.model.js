module.exports = (sequelize, Sequelize) => {
  const Sharing = sequelize.define("sharings", {
    sharingstring: {
      type: Sequelize.STRING
    }
  });

  return Sharing;
};