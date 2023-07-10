const mongoose = require('mongoose');
const { Schema } = mongoose


const CommentsSchema = Schema({
    text: String,
    user_id: String,
    date: Date,
    article_id: String
})

const CommentsModel = mongoose.model('Comments', CommentsSchema);


module.exports = CommentsModel;