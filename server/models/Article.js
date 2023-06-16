const mongoose = require('mongoose');
const { Schema } = mongoose


const ArticleSchema = Schema({
    title: String,
    preview: String,
    content: String,
    created_at: Date,
    updated_at: Date,
    category: String,
    author: String,
    image: String,
})

const ArticleModel = mongoose.model('Article', ArticleSchema);


module.exports = ArticleModel;