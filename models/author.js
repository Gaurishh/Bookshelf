//This file contains the mongoose author models which can be imported by other files.

const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next){ //runs the given function before we remove any author
    Book.find({author: this.id}, (err, books) => {
        if(err){
            next(err) //passes error to the next function
        }else if(books.length > 0){
            next(new Error('This author has books still'))
        }else{
            next() //continue removal
        }
    })
})

module.exports = mongoose.model('Author', authorSchema)