const express = require('express');
const router = express.Router();
const Admin = require('../Models/Admin');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Ticket = require('../Models/Ticket');

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const JWT_SECRET =  process.env.JWT_SECRET;

router.post('/createadmin', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            return res.status(400).json({success, error: "Sorry a user with this email already exists" });
        }
        // Password Hashing
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt);

        //  Create a new user
        admin = await Admin.create({
            name: req.body.name,
            email: req.body.email,
            password: securePass,
        })

        const data = {
            admin: {
                id: admin.id
            }
        }
        const adminToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, adminToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, admin.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials " })
        }

        const data = {
            admin: {
                id: admin.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET); 
        success = true;
        res.json({ success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})


const mongoose = require('mongoose');
// const userInfo = mongoose.model('user');
router.get('/getallusers', async (req, res) => {

    try {
        // const user = await userInfo.find(); 
        const user = await mongoose.model('users').find(); 
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})

router.get('/getalltickets', async (req, res) => {

    try {
        // const user = await userInfo.find(); 
        const ticket = await mongoose.model('tickets').find(); 
        res.send(ticket);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})

router.get('/verifyticket/:id', async (req, res) => {
    try {
        // const user = await userInfo.find();
        const ticket = await mongoose.model('tickets').findById(req.params.id);
        if (!ticket) {
            return res.status(404).send("Not Found");
        }
        ticket.visited = true;
        ticket.visitedOn = Date.now()
        const a1 = await ticket.save();
        res.json(a1);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})

// router.delete('/deleteuser/:id', fetchadmin,  async (req, res) => {
router.delete('/deleteuser/:id',   async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Not Found");
        }

        user = await User.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Ticket has been deleted", user: user })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})

// router.delete('/deleteticket/:id',fetchadmin, async (req, res) => {
router.delete('/deleteticket/:id', async (req, res) => {
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

// get all tickets corresponding to each user
router.get('/getalltickets/:id', async (req, res) => {

    try {
        // const user = await userInfo.find();
        const ticket = await mongoose.model('tickets').find({ user: req.params.id });
        res.send(ticket);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occur");
    }
})


module.exports = router;