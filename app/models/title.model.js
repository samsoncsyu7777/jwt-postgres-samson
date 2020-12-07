module.exports = (sequelize, Sequelize) => {
  const Title = sequelize.define("titles", {
    titlestring: {
      type: Sequelize.STRING
    }
  });

  return Title;
};