let bookR = require('./book');

class Router {
    constructor(app){
        new bookR(app);
    }
}

module.exports = Router;