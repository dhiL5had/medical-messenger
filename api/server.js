const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
require('dotenv').config();

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);

const io = require('socket.io')(server, {
  cors: "*"
});
const Message = require('./models/message');

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('join', (data)=> {
    socket.join(data.roomId);
  })
  socket.on('message', (data) => {
    const { message, roomId, senderId } = data;
    const msg = new Message({
      message,
      roomId,
      senderId
    });
    msg.save().then(response => {
      io.sockets.in(roomId).emit('message', data);
    }).catch(err => {
      console.log(err);
      console.log("Message upload failed");
    });

  });
  socket.on('disconnect', () => {
    socket.leave();
    socket.removeAllListeners(["message"]);
    console.log('a user left and disconnected!');
  });
});

server.listen(port);
