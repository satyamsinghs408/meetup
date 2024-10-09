const dotenv = require("dotenv");
const Sequelize = require("sequelize");

dotenv.config();

let sequelize;


if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
      dialect: "mysql",
      host: process.env.DB_HOST,
      logging: process.env.NODE_ENV === "production" ? false : console.log,
    }
  );
}

module.exports = sequelize;
