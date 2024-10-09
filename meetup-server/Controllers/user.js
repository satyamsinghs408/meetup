const bcrypt = require("bcrypt");
const Joi = require("joi");

const User = require("../Modals/User");
const jwt = require("jsonwebtoken");
const Token = require("../Modals/Token");
const sendEmail = require("../util/sendEmail");


const PORT = process.env.PORT
  ? "https://meetup-frontend-byy3.onrender.com"
  : "http://localhost:3000";

exports.postAddUser = async (req, res) => {
  const schema = Joi.object({
    enteredEmail: Joi.string().email().normalize().required(),
    enteredPassword: Joi.string().required(),
    enteredName: Joi.string().required(),
  });
  error = schema.validate(req.body).error;
  console.log(error);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const name = req.body.enteredName;
  const email = req.body.enteredEmail;
  const password = req.body.enteredPassword;

  let newHashPassword;
  const exisitingUser = await User.findOne({ where: { email } });
  if (exisitingUser)
    return res.status(409).json({ message: "user already exists" });
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  const user = await User.create({
    name: name,
    email: email,
    password: hash,
  });
  const token = jwt.sign(
    { userid: user.id, username: name, email: email },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.json({
    message: "User created successfully",
    token,
    user: { email: user.email, name: user.name },
  });
};
exports.verifyUser = async (req, res) => {
  const schema = Joi.object({
    enteredEmail: Joi.string().email().normalize().required(),
    enteredPassword: Joi.string().required(),
  });
  error = schema.validate(req.body).error;
  if (error) return res.status(400).send({ message: error.details[0].message });

  const email = req.body.enteredEmail;
  const password = req.body.enteredPassword;

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            const token = jwt.sign(
              { userid: user.id, username: user.name, email: user.email },
              process.env.SECRET_KEY,
              { expiresIn: "3000" }
            );
            console.log(token);
            return res.status(200).json({
              message: "successfull",
              token,
              user: { email: user.email, name: user.name },
            }); // implement logout middleware
          } else {
            return res.status(204).json({ message: "Invalid Password" });
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({ message: "failed" });
        });
    } else {
      return res.json({ message: "User not found" });
    }
  } catch (err) {
    return res.send({ message: "failed" });
  }
};

exports.refreshToken = async (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(401).json({ message: "no token" });
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "invalid token" });
    const newToken = jwt.sign(
      { userid: user.userid, username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token: newToken });
  });
};

exports.passwordReset = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    let token = await Token.findOne({ where: { userId: user.id } });
    if (token) await token.destroy();
    if (!token) {
      const array = new Uint32Array(1);
      const crypToken = crypto.getRandomValues(array).toString("hex");
      token = await Token.create({
        userId: user.id,
        token: crypToken,
      });
    }
    const link = `${PORT}/forgotpassword/${user.id}/${token.token}`;
    console.log(PORT);
    await sendEmail(user.email, "Password reset", link);
    res.send({ message: "Password reset link sent to your email", link: link });
  } catch (error) {
    res.send("Something went wrong");
    console.log(error);
  }
};

exports.passwordResetToken = async (req, res) => {
  console.log(req.params.userId, req.params.token, req.body.password);
  const schema = Joi.object({
    password: Joi.string().required().min(6),
  });
  error = schema.validate(req.body).error;
  if (error) return res.status(400).send({ message: error.details[0].message });

  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = await Token.findOne({
      where: { userId: user.id, token: req.params.token },
    });

    if (!token) return res.status(404).json({ message: "Invalid token" });
    
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const newHashPassword = await bcrypt.hash(req.body.password, salt);
    user.password = newHashPassword;
    await user.save();
    await token.destroy();
    res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    res.status(404).send("Password reset failed");
  }
};
