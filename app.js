const express = require('express');
const fileupload = require('express-fileupload')
const path = require('path');
const colors = require('colors');
const cors = require('cors')

const app = express();
const http = require('http').Server(app);


// // Load Controllers
const user = require('./routes/user');

// // Set Controller
app.use('/api/user', user);

// Load Parser
app.use(express.json());

// File Upload Middleware
app.use(fileupload());

// set cors
app.use(cors())

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
