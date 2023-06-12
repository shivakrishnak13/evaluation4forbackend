const mongoose = require("mongoose");


const backlistSchema = mongoose.Schema({btoken: String});

const BlacklistModel = mongoose.model("blacklist",backlistSchema);

module.exports = {BlacklistModel};