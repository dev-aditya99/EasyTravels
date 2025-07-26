const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err.message);
})

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/wonderList")
}

const initDB = async () => {
    await Listing.deleteMany({});
    
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6873acdb89ced5a768a92fa0" }))
    await Listing.insertMany(initData.data)
    console.log("Data Initiallized");
}

initDB()