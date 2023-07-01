const express = require('express')
const router = express.Router() //this is exported later
const Author = require('../models/author')
const Book = require('../models/book')

//All authors Route
router.get('/', async (req, res) => { //corresponds to /authors/

    let searchOptions = {}
    if(req.query.name !== null && req.query.name !==''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {authors: authors, searchOptions: req.query})
    }
    catch{
        res.redirect('/')
    }
})

//New Author Route

router.get('/new', (req, res) => { //corresponds to /authors/new
    res.render('authors/new', {author: new Author()})
})

//Create Author Route
router.post('/', async(req, res) => {

    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save()
        res.redirect('authors/' + newAuthor.id)
    } catch (error) {
        res.render('authors/new', {
            author: author, //so that user doesn't have to type the author name again.
            errorMessage: 'Error creating author'
        })
    }

    // author.save().then((newAuthor)=>{
    //     // res.redirect('authors/' + newAuthor.id)
    //     res.redirect('authors')
    // }).catch((err)=>{
    //     res.render('authors/new', {
    //         author: author, //so that user doesn't have to type the author name again.
    //         errorMessage: 'Error creating author'
    //     })
    // })
    // console.log(req.body)
    // res.send(req.body.name)
})

router.get('/:id', async (req, res) => { //this route must be written AFTER THE 'NEW AUTHOR' route in the code
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch(err){
        console.log(err)
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
    }catch{
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {

    let author

    try {

        author = await Author.findById(req.params.id) //line I
        author.name = req.body.name
        await author.save() //line II
        res.redirect('/authors/' + author.id)
        // res.redirect('authors')
    } catch{
        if(author==null){ //error at line I
            res.redirect('/')
        }
        else{ //error at line II
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating the author'
            }) 
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author

    try {
        author = await Author.findById(req.params.id) //line I
        await author.remove() //line II
        res.redirect('/authors')
        // res.redirect('authors')
    } catch{
        if(author==null){ //error at line I
            res.redirect('/')
        }
        else{ //error at line II
            res.redirect('/authors/' + author.id)
        }
    }
})



module.exports = router