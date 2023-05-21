const mongoose = require('mongoose')

const { Schema } = mongoose;

const TicketSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },

    monument: {
        type: String,
        required: true
    },
    state: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    dateOfVisit: {
        type: String,
    },
    numberOfTicket: {
        type: String,
    },
    visited: {
        type: Boolean,
        default: false
    },
    visitedOn: {
        type : Number,
    },
    date: {
        type: Number,
        default: Date
    }
});
module.exports = mongoose.model('tickets', TicketSchema);