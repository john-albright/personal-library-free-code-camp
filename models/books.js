const mongoose = require('mongoose');

const { Schema } = mongoose;

const booksSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    commentcount: {
        type: Number,
        default: 0
    },
    comments: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Book', booksSchema);