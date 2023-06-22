const express = require('express');
// const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({path : './config.env'});
const connectToMongo = require('./db')
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
//  Available Routes

app.use('/api/auth', require('./Routes/auth'))
app.use('/api/ticket', require('./Routes/ticket'))
app.use('/admin', require('./Routes/admin'))

app.get('/', (req, res) => {
  res.send('Hello Harsh!')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
