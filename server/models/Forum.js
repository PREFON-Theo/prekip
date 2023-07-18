const mongoose = require('mongoose');
const { Schema } = mongoose


const ForumSchema = Schema({
    title: String,
    description: String,
    author: String,
    image: Object,
    file: Object,
    closed: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    important: {
        type: Boolean,
        default: false
    },
})

const ForumModel = mongoose.model('Forum', ForumSchema);


module.exports = ForumModel;