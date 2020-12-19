const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    nome : {
        type: String,
        required: true
    },
    likes: {
        type: String,
        unique: true,  
    },
    date: {
      type: Date,
      default: Date.now
    }
})

module.exports = mongoose.model('place', PlaceSchema);