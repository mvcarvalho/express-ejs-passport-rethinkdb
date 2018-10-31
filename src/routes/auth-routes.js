const express = require('express');
const AuthController = require('../controllers/auth-controller');

module.exports = function Router(nav) {
  const authRouter = express.Router();
  const authController = new AuthController(nav);

  authRouter.route('/sign-up')
    .post(authController.postSignUp);

  authRouter.route('/sign-in')
    .get(authController.getSignIn)
    .post(authController.postSignIn);

  authRouter.route('/profile')
    .all(authController.authProfileMiddleware)
    .get(authController.getProfile);

  return authRouter;
};
