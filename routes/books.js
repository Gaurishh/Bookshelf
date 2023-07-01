const express = require('express')
const router = express.Router() //this is exported later
const Book = require('../models/book')
const multer = require('multer')
const path = require('path')
const fs = require('fs') //fs = fileSystem //to delete the book covers that we dont need(the ones that got created even after error)
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'] //contains all the image types which are going to be accepted
const Author = require('../models/author')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => { //allows to see which files the server is going to accept
        callback(null, true)  
    }
})

//All books Route
router.get('/', async (req, res) => { //corresponds to /books/

    let query = Book.find()
    // console.log(query)
    if(req.query.title!=null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore!=null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore) //lte means less than or equal
    }
    if(req.query.publishedAfter!=null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter) //gte means greater than or equal
    }

    try {

        // const books = await Book.find({})
        const books = await query.exec()
        console.log(books)
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })

    } catch{
        res.redirect('/')
    }

    
})

//New Book Route
router.get('/new', async (req, res) => { //corresponds to /books/new
    // res.send('New book')
    renderNewPage(res, new Book())
})

//Create Book Route
router.post('/', upload.single('cover'), async(req, res) => {
    // res.send('Create book')
    const fileName = req.file != null ? req.file.filename : null

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newBook = await book.save()
        // res.redirect('books/' + newBook.id)
        res.redirect('books')
    } catch{
        if(book.coverImageName != null){
            renderBookCover(book.coverImageName)
        }
        renderNewPage(res, new Book()) //if error, go back to add book page     
    }
})

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err){
            console.err(err) //no need to ruin the experience for the user by sending it to him/her, hence we just log it.
        }
    })
}

async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({})
        const params =  {
            authors: authors,
            book: book
        }
        // const book = new Book()
        if(hasError){
            params.errorMessage = 'Error creating Book'
        }
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

module.exports = router