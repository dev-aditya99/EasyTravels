const User = require("../models/user.js");

// Render Signup Form Route 
module.exports.renderSignupForm = async (req, res) => {
    res.render("users/signup.ejs")
}

// Signup Route 
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        let newUser = new User({ username, email })
        let registerdUser = await User.register(newUser, password);
        req.login(registerdUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to WonderList")
            res.redirect("/listings")
        })

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup")
    }
}

// Render Login Form Route 
module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login.ejs")
}

// Login Route 
module.exports.login = async (req, res) => {
    req.flash("success", "You're Logged-in!")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
}

// Logout Route 
module.exports.logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logged-out successful!")
        res.redirect("/login")

    })
}
