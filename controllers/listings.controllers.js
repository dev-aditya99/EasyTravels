const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const { storage } = require('../cloudConfig.js');
const {v2 : cloudinary} = require("cloudinary")


// Index Route
module.exports.index = async (req, res) => {
    let allListings = await Listing.find().populate("owner")
    res.render("listings/index.ejs", { allListings })
}

// New Listing Form Route
module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs")
}

// Show Route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    res.render("listings/showListing.ejs", { listing })
}


// Create New Listing Route 
module.exports.createListing = async (req, res) => {
    let { title, description, price, location, country } = req.body;

    let response = await geocodingClient.forwardGeocode({
        query: `${location}, ${country}`,
        limit: 1
    }).send();


    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing({
        title, description, image: { url, filename }, price, location, country
    });

    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings/" + newListing._id)
}


// Edit Listing Form Route 
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "This Listing Doesn't Exist!");
        res.redirect("/listings");
    }

    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload", "/upload/w_250/e_blur:10/")

    res.render("listings/edit.ejs", { listing, originalImageURL })
}

// Update Listing Route 
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;

    let response = await geocodingClient.forwardGeocode({
        query: `${location}, ${country}`,
        limit: 1
    }).send();

    let listing = await Listing.findByIdAndUpdate({ _id: id }, { title, description, price, location, country, geometry: response.body.features[0].geometry });

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }


    req.flash("success", "Listing Updated!");
    res.redirect("/listings/" + id);
}


// Delete Listing Route 
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

   let listing = await Listing.findByIdAndDelete(id);
   await cloudinary.uploader.destroy(listing.image.filename);
    req.flash("success", `Listing with Id : ${id} is Deleted!`)
    res.redirect("/listings/")
}