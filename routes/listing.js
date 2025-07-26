const express = require('express');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middlewares.js');
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, destroyListing } = require('../controllers/listings.controllers.js');

const multer = require("multer");
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// Listing Router
const listigRouter = express.Router();


// Get All the Listings Route
listigRouter.get("/", wrapAsync(index));

// Create New Listing Form AND Create New Listing Route 
listigRouter.route("/new")
    .get(isLoggedIn, wrapAsync(renderNewForm))
    .post(isLoggedIn, validateListing, upload.single('image'), wrapAsync(createListing));


// Get a Perticular Route / Show Route
listigRouter.get("/:id", wrapAsync(showListing));


// Edit Listing Form Route AND Update Listing Route 
listigRouter.route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(renderEditForm))
    .put(isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(updateListing));


// Delete Listing Route 
listigRouter.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(destroyListing))


module.exports = listigRouter;