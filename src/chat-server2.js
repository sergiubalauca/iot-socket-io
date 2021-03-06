var PORT = process.env.PORT || 8000;
var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {

  console.log('a user connected');

  socket.on('message', function (data) {
    console.log(data);
    io.emit('message', data);
  });

});