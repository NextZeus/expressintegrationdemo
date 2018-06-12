let bookC = require('../controller/book');

class Router {
    constructor(app) {
        app.route('/book')
            .get(bookC.getBooks)
            .post(bookC.postBook);

        app.route('/book/:id')
            .get(bookC.getBook)
            .delete(bookC.deleteBook)
            .put(bookC.updateBook);
    }
}

module.exports = Router;