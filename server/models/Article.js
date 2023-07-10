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
    file: String,
    /*imageUrl: String,
    imageName: String,
    fileUrl: String,
    fileName: String,*/
})

const ArticleModel = mongoose.model('Article', ArticleSchema);


module.exports = ArticleModel;