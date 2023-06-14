const mongoose = require('mongoose');
const { Schema } = mongoose


const EventSchema = Schema({
    title: String,
    description: String,
    startDate: Date,
    finishDate: Date,
    type: String,
    owner: String,
})

const EventModel = mongoose.model('Event', EventSchema);


module.exports = EventModel;