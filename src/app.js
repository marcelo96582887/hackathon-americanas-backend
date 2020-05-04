const server = require('./server');
require('dotenv/config');

const PORT = process.env.PORT;
server.listen(PORT);
