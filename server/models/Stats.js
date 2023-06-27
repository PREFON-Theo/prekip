const mongoose = require('mongoose');
const { Schema } = mongoose


const StatsSchema = Schema({
    value: Number,
    text: String,
    link: String,
    currency: String,
    type: String
})

const StatsModel = mongoose.model('Stats', StatsSchema);


module.exports = StatsModel;