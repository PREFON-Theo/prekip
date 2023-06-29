const mongoose = require('mongoose');
const { Schema } = mongoose


const LikeSchema = Schema({
    user_id: String,
    article_id: String,
})

const LikeModel = mongoose.model('Like', LikeSchema);


module.exports = LikeModel;