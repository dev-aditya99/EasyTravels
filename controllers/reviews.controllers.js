const Listing = require("../models/listing");
const Review = require("../models/review");

// Create Review Router 
module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let { rating, comments } = req.body;
    let listing = await Listing.findById(id)
    let review = new Review({
        rating, comments, author: req.user._id
    })


    await review.save();
    await Listing.updateOne({ _id: id }, { reviews: [...listing?.reviews, review] });

    req.flash("success", "New Review Added!");
    res.redirect("/listings/" + listing._id)
}

// Delete Review Route
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)

    req.flash("success", "Review Deleted!");
    res.redirect("/listings/" + id)
}