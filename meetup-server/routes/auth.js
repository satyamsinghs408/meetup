const express = require('express')

const router = express.Router();
const userController = require('../Controllers/user');


router.post("/add-user", userController.postAddUser);

router.post("/login",userController.verifyUser);

router.post("/refresh-token", userController.refreshToken);

router.post("/password-reset", userController.passwordReset);

router.post("/password-reset/:userId/:token", userController.passwordResetToken);

module.exports = router;