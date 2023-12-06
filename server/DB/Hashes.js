const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name:String,
    hash:String
})


module.exports = mongoose.model('fileNameHash',productSchema);