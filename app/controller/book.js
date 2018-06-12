// book route
let Book = require('../models/book');

/*
 * GET /book route to retrieve all the books.
 */
function getBooks(req, res) {
    // Query the DB and if no errors, send all the books
    return Book.find({})
        .then((books) => {
            return res.status(200).json(books);
        })
        .catch(err => {
            return res.send(err);
        });
}

/*
 * POST /book to save a new book.
 */
function postBook(req, res) {
    var newBook = new Book(req.body);

    return newBook.save()
        .then((book) => {
            return res.json({message: 'Book successfully added!', book });
        })
        .catch(err => {
            return res.send(err);
        });
}

/*
 * GET /book/:id route to retrieve a book given its id.
 */
function getBook(req, res) {
    return Book.findById(req.params.id)
        .then(book => {
            return res.status(200).json(book);
        })
        .catch(err => {
            return res.send(err);
        });
}

/*
 * DELETE /book/:id to delete a book given its id.
 */
function deleteBook(req, res) {
    return Book.remove({_id: req.params.id})
        .then(result => {
            return res.status(200).json({ message: 'Book successfully deleted!', result });
        })
        .catch(err => {
            return res.send(err);
        });
}

/*
 * PUT /book/:id to updatea a book given its id
 */
function updateBook(req, res) {
    return Book.findById({_id: req.params.id})
        .then((book) => {
            Object.assign(book, req.body).save();
            return res.status(200).json({ message: 'Book updated!', book });
        })
        .catch(err => {
            return res.send(err);
        });
}

// export all the functions
module.exports = { getBooks, postBook, getBook, deleteBook, updateBook };