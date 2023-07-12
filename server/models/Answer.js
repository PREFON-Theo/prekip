const mongoose = require('mongoose');
const { Schema } = mongoose


const AnswerSchema = Schema({
    text: String,
    user_id: String,
    date: Date,
    forum_id: String
})

const AnswerModel = mongoose.model('Answer', AnswerSchema);


module.exports = AnswerModel;