const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const server = express();

// configura o servidor para trabalhar com JSON
server.use(cors());
server.use(express.json());
server.use(routes);

module.exports = server;