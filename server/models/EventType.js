const mongoose = require('mongoose');
const { Schema } = mongoose


const EventTypeSchema = Schema({
    title: String,
    description: String,
    parent: String,
    color: String,
})

const EventTypeModel = mongoose.model('EventType', EventTypeSchema);


module.exports = EventTypeModel;