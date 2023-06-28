//This file contains the mongoose author models which can be imported by other files.

const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Author', authorSchema)