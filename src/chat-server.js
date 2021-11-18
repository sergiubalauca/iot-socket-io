const app = require('express')();
const appWs = require('express-ws')(app);

app.ws('/', (ws) => {
  ws.on('message', (msg) => {
    console.log('Received: ', msg);
    ws.send(msg);
    ws.emit('testingtesting');
  });

  ws.on('set-name', (msg) => {
    console.log('Received SETNAME: ', msg);
    ws.send(msg);
    ws.emit('alabala');
  });
});

app.listen(8000, () => {
  console.log('Server has been started');
});
