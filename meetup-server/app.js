const http = require("http");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");
const morgan = require("morgan");

require("dotenv").config();

const authRouter = require("./routes/auth");
const meetupRouter = require("./routes/meetup");
const User = require("./Modals/User");
const Meetup = require("./Modals/Meetup");
const { default: helmet } = require("helmet");
const compression = require("compression");

const app = express();

app.use(helmet());
app.use(compression());

app.use(bodyParser.json());

app.use(cors());
app.use(morgan("tiny"));

app.use("/users", authRouter);
app.use("/meetup", meetupRouter);

app.use((req, res) => {
  res.status(404).send("<h1>Page not found</h1>");
});

Meetup.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Meetup);

sequelize
  .sync() //{force:true}
  .then((result) => {
    const server = http.createServer(app);
    const PORT = process.env.PORT || 3003;
    server.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
