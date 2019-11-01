module.exports = (sequelize, type) => {
  return sequelize.define("users", {
    name: {
      type: type.STRING
    },
    email: {
      type: type.STRING,
      primaryKey: true,
      unique: true
    },
    password: {
      type: type.STRING
    }
  });
};
