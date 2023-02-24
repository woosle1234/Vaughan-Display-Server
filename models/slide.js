const mongoose = require("mongoose"); 

const slideSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String
    },
    name: String,
    position: Number
})

const slide = mongoose.model('slide',slideSchema);
module.exports = slide;