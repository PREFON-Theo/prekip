const mongoose = require('mongoose');
const { Schema } = mongoose


const AnswerSchema = Schema({
    text: String,
    user_id: String,
    forum_id: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    vote: {
        type: Number,
        default: 0
    }
})

const AnswerModel = mongoose.model('Answer', AnswerSchema);


module.exports = AnswerModel;