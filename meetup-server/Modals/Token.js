const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Token = sequelize.define("token", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
      defaultValue: Sequelize.NOW,
    expires: 3600,
  },
});

module.exports = Token;