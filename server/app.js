require('dotenv').config();

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Middleware

// app.use(function (req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

// app.get('/', (req, res) => {
//     res.send('Hello world!');
// });

app.use(express.json());

app.use('/api', require('./routes/index'));

app.use(errorMiddleware);

// const server = http.createServer(app);

const bootstrap = async () => {
    try {
        const PORT = process.env.PORT || 6000;

        mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'));

        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

bootstrap();