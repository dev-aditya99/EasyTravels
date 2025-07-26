const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require('./utils/ExpressError.js');

// Is Logged-In 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        // if (req.originalMethod == "POST") {
        //     req.session.redirectUrl = "/listings";
        // }
        req.flash("error", "You must be logged-in for this action!");
        return res.redirect("/login")
    }
    next()
};

// Save Redirect URL 
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
};

// Is Owner 
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.curUser._id)) {
        req.flash("error", "You're not allowed to make changes to this listing!")
        return res.redirect("/listings/" + id)
    }

    next()
};

// Validate Listing 
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
};

// Validate Review 
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}


// Is Review Author 
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review.author._id.equals(res.locals.curUser._id)) {
        req.flash("error", "You're not allowed to make changes to this review!")
        return res.redirect("/listings/" + id)
    }

    next()
};