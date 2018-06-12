let mongoose = require('mongoose');
let Promise = require('bluebird');
let config = require('config');

mongoose.Promise = Promise;
// promisify mongoose
Promise.promisifyAll(mongoose.Model);
Promise.promisifyAll(mongoose.Model.prototype);
Promise.promisifyAll(mongoose.Query.prototype);

let options = {
    server:  {socketOptions: { keepAlive: 1, connectTimeoutMS: 30000}},
    replset: {socketOptions: { keepAlive: 1, connectTimeoutMS: 30000}},
};

console.log('config %j', config);

let conn = mongoose.createConnection(config.DBHost, options);
conn.on('error', console.error.bind(console, 'connection error'));

module.exports = conn;