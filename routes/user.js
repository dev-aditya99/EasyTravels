const express = require('express');
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middlewares.js');
const { renderSignupForm, signup, login, logout, renderLoginForm } = require('../controllers/users.controllers.js');

const userRouter = express.Router();

// Signup form Route AND Signup User Route
userRouter.route("/signup")
    .get(wrapAsync(renderSignupForm))
    .post(wrapAsync(signup));

// Login form  Route AND Login User Route
userRouter.route("/login")
    .get(wrapAsync(renderLoginForm))
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: "/signup", failureFlash: true }), wrapAsync(login));

// Get Logout Route 
userRouter.get("/logout", wrapAsync(logout))

module.exports = userRouter;