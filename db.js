const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
useNewUrlParser: true,
useUnifiedTopology: true,
// useCreateIndex: true,
// useFindAndModify: false,
})
.then(() => {
    console.log('Database connected');
}).catch((error) => console.log(error.message));

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected');
});

mongoose.connection.on('error', (error) => {
    console.log(error.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
