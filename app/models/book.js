let mongoose = require('mongoose');
let conn = require('./index');

let Schema = mongoose.Schema;

// book schema definition
let BookSchema = new Schema(
    {
        title:     { type: String, required: true },
        author:    { type: String, required: true },
        year:      { type: Number, required: true },
        pages:     { type: Number, required: true, min: 1 },
        createdAt: { type: Date, default: Date.now },
    },
    {
        versionKey: false
    }
);

// Sets the createdAt parameter equal to the current time
BookSchema.pre('save', next => {
    let now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

// Exports the BookSchema for use elsewhere.
module.exports = conn.model('book', BookSchema);