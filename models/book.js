//This file contains the mongoose book models which can be imported by other files.

const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, //mongoose schema(authorSchema)
        required: true,
        ref: 'Author' //this is the collection name which is associated with the above mongoose schema
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath