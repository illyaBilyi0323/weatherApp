const server = require('./server/main');
const PORT = process.env.PORT || 8080;
server.startServer(PORT);