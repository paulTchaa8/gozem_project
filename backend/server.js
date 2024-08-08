const http = require('http')
const { Server } = require('socket.io');
const app = require('./app')

const Delivery = require('./models/delivery')

const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated priviledges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('New client connected')

  socket.on('location_changed', async (data) => {
    const delivery = await Delivery.findOneAndUpdate(
        { delivery_id: data.delivery_id },
        { location: data.location }
    )
    io.emit('delivery_updated', delivery)
  })

  socket.on('status_changed', async (data) => {
      const delivery = await Delivery.findOneAndUpdate(
          { delivery_id: data.delivery_id },
          { status: data.status }
      )
      io.emit('delivery_updated', delivery)
  })

  socket.on('disconnect', () => {
      console.log('Client disconnected')
  })
})

server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind);
});

server.listen(port)
