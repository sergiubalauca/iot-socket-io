const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: '*'
}));

const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');



app.get('/', (req, res) => {
  res.send('Hello from server!');
});

server.listen(PORT, () => {
  console.log('Server listening on port: ', PORT);
});

const io = require('socket.io')(server, {
  cors: {
      origin: '*'
  }
});

// const io = new socketIO.Server(server, {
//   cors: {
//       origin: '*'
//   }
// });

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('message', (data) => {
    console.log('Message: ', data);
    io.emit('message', { data: data.text, user: socket.data['name'], createdAt: new Date() });
  });

  socket.on('disconnect', () => {
    io.emit('users-changed', { user: socket.id, event: 'left' });
  });

  socket.on('set-name', (name) => {
    socket.data['name'] = name;
    console.log('SET NAME: ', socket.data['name']);
    io.emit('users-changed', { user: socket.data['name'], event: 'joined' });
  });

  socket.on('send-message', (msg) => {
    io.emit('message', { msg: msg.text, user: socket.data['name'], createdAt: new Date() });
  });
});
