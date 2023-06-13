const mongoose = require('mongoose');
const { Schema } = mongoose


const EventsSchema = Schema({
    title: String,
    description: String,
    startDate: Date,
    finishDate: Date,
    type: String,
    owner: String,
})

const EventsModel = mongoose.model('Events', EventsSchema);


module.exports = EventsModel;