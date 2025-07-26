const express = require('express');
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middlewares.js');
const { createReview, destroyReview } = require('../controllers/reviews.controllers.js');

// Reviews Router 
const reviewsRouter = express.Router({ mergeParams: true });


// Post Route 
reviewsRouter.post("/", isLoggedIn, validateReview, wrapAsync(createReview))

// Delete Review Route 
reviewsRouter.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(destroyReview))


module.exports = reviewsRouter;