const mongoose = require('mongoose');
const { Schema } = mongoose


const ForumSchema = Schema({
    title: String,
    description: String,
    author: String,
    image: Object,
    file: Object,
    closed: Boolean,
    created_at: Date,
    updated_at: Date,
})

const ForumModel = mongoose.model('Forum', ForumSchema);


module.exports = ForumModel;