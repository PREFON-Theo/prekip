const mongoose = require('mongoose');
const { Schema } = mongoose


const StatsTypeSchema = Schema({
    title: String,
})

const StatsTypeModel = mongoose.model('StatsType', StatsTypeSchema);


module.exports = StatsTypeModel;