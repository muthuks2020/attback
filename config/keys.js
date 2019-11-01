const Sequelize = require("sequelize").Sequelize;


const sequelize = new Sequelize({
    host: "remotemysql.com",
    database: "wbKy8791v3",
    username: "wbKy8791v3",
    password: "KGX7veoi6h",
    dialect: "mysql",
    port: 3306,
    //   pool: {
    //     max: 10,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    //   }
    logging: false
});

const departments = ["ABC", "DEF", "GHI", "JKL", "MNO"]

const leaveTypes = ["Loss Of Pay", "Comp Off", "Paid Leave", "Paternity Leave", "Restricted Holiday", "Business Travel", "Work From Home", "Other"]

module.exports = {
    secretOrKey: "ams#123",
    sequelize,
    departments,
    leaveTypes
};

