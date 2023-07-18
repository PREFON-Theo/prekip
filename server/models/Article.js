const mongoose = require('mongoose');
const { Schema } = mongoose


const ArticleSchema = Schema({
    title: String,
    preview: String,
    content: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    category: String,
    author: String,
    image: Object,
    file: Object,
    important: {
        type: Boolean,
        default: false
    },
    type: String,
})

const ArticleModel = mongoose.model('Article', ArticleSchema);


module.exports = ArticleModel;