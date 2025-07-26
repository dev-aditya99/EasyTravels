const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require('path');

if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}

const ExpressError = require("./utils/ExpressError.js")
const listigRouter = require("./routes/listing.js");
const reviewsRouter = require('./routes/reviews.js');
const userRouter = require('./routes/user.js');

const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require("passport-local")
const User = require('./models/user.js');
const wrapAsync = require('./utils/wrapAsync.js');

const app = express();
const PORT = 8080;

app.use(methodOverride("_method"))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate)

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))

// SCERET 
const secret = process.env.SECRET;

// Mongo DB URL 
const atlasURL = process.env.ATLASDB_URL;

// connect to mongodb 
main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err.message);
})


// main fn 
async function main() {
    mongoose.connect(atlasURL)
}


// Store 
const store = MongoStore.create({
mongoUrl:atlasURL,
crypto:{
    secret:secret
},
touchAfter: 24*60*60
})

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

// Session Options 
const sessionOptions = {
    store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

// Root Route 
app.get("/", (req, res) => {
    res.redirect("/listings")
})


// Session 
app.use(session(sessionOptions));
app.use(flash());


// Passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    res.locals.curPath = req.url;

    next();
})


// listings 
app.use("/listings", listigRouter)
// Reviews 
app.use("/listings/:id/reviews", reviewsRouter)
// User
app.use("/", userRouter)

// Privacy Policy Route 
app.get("/privacy", wrapAsync(async(req, res) => {
    res.render("others/privacy.ejs")
}))

// Terms & Conditions Route 
app.get("/terms", wrapAsync(async(req, res) => {
    res.render("others/terms.ejs")
}))

// Developer Route 
app.get("/developer", wrapAsync(async(req, res) => {
    res.render("others/developer.ejs")
}))




app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message);
})


app.listen(PORT, () => {
    console.log(`Server is running on the PORT : ${PORT}`);
})