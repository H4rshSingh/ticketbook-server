const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const Ticket = require('../Models/Ticket');

// ROUTE 1 : Get All the notes using : GET "/api/auth/fetchallnotes".   Login required
router.get('/fetchalltickets', fetchuser, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id });
        res.json(tickets)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})


// ROUTE 2 : Add a new Note using : POST "/api/auth/addnote".   Login required
router.post('/bookticket', fetchuser, async (req, res) => {

    try {
        const {fname, lname, monument, state, email, phone, numberOfTicket, visited, dateOfVisit } = req.body;
        // If there are errors, return bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const ticket = new Ticket({
            fname, lname, monument, state, email, phone, numberOfTicket, visited, dateOfVisit, user: req.user.id
        })
        const savedTicket = await ticket.save()
        res.json(savedTicket)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deleteticket/:id',  async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send("Not Found");
        }

        ticket = await Ticket.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Ticket has been deleted", ticket: ticket })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})




module.exports = router