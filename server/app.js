require('dotenv').config();

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware

// app.use(function (req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

// app.get('/', (req, res) => {
//     res.send('Hello world!');
// });

app.use('/api', require('./routes/index'));

// const server = http.createServer(app);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));