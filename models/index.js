const UsersModel = require("./users");
const PersonsModel = require("./persons");
const PresentModel = require("./present");
const LeaveModel = require("./leaves");
const Sequelize = require("sequelize").Sequelize;
const sequelize = require('../config/keys').sequelize


const User = UsersModel(sequelize, Sequelize);
const Person = PersonsModel(sequelize, Sequelize);
const Present = PresentModel(sequelize, Sequelize);
const Leave = LeaveModel(sequelize, Sequelize);

module.exports = {
  User,
  Person,
  Present,
  Leave
};
