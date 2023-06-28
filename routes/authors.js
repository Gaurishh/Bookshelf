const express = require('express')
const router = express.Router() //this is exported later
const Author = require('../models/author')

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
        // res.redirect('authors/' + newAuthor.id)
        res.redirect('authors')
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

module.exports = router