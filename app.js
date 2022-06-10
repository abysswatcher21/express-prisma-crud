const express = require('express');
const fileupload = require('express-fileupload')
const path = require('path');
const colors = require('colors');
const cors = require('cors')

const app = express();
const http = require('http').Server(app);

const error = require('./middleware/error');
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require('express-validator');

global.asyncHandler = require('./middleware/async');
global.ErrorResponse = require('./library/errorResponse');
global.prismaTable = require('./library/prismatable');
global.moment = require('moment');
global.bcrypt = require('bcryptjs');
global.jwt = require('jsonwebtoken');
global.body = body;
global.validationResult = validationResult;
global.prisma = new PrismaClient({});

prisma.$on('query', (e) => {
    // console.log('Query: ' + e.query)
    // console.log('Params: ' + e.params)
    // console.log('Duration: ' + e.duration + 'ms')
})

// Load Controllers
const user = require('./routes/user');
const post = require('./routes/post');


// Load Parser
app.use(express.json());

// File Upload Middleware
app.use(fileupload());

// set cors
app.use(cors())

// Set Controller
app.use('/api/user', user);
app.use('/api/post', post);

app.use(error)

// Specifying PORT
const PORT = process.env.PORT || 8080;

// Specifying Server
const server = http.listen(PORT, console.log(`Server Running on port ${PORT}`.yellow.bold));

// HANDLE unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    // console.log(err);
    console.log(`Error: ${err.message}`.red);
    // Close server % exit
    // server.close(() => process.exit(1));
})
