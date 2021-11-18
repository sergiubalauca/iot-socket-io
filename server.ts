import express, { Application } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const WebSocket = require("ws");
const app: Application = express();
import cors from 'cors';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

app.use(cors());
app.options('*', cors);

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    console.log('connection with socket: ', socket.id);
    socket.on('disconnect', () => {
        io.emit('users-changed', { user: socket.id, event: 'left' });
    });

    socket.on('message', (msg) => {
        console.log('Message: ', msg);
        io.emit('message', { msg: msg.text, user: socket.data['name'], createdAt: new Date() });
    });

    socket.on('set-name', (name) => {
        socket.data['name'] = name;
        console.log('SET NAME: ', socket.data['name']);
        io.emit('users-changed', { user: socket.data['name'], event: 'joined' });
    });

    socket.on('send-message', (msg) => {
        io.emit('message', { msg: msg.text, user: socket.data['name'], createdAt: new Date() });
    });

    // socket.broadcast.emit('hi');
});

server.listen(PORT, (): void => {
    const host = JSON.stringify(server.address());
    console.log(`Server Running here 👉 ${host}`);
});


// ============================================
// const chat = {
//     run: function (host: any, port: any) {
//         const wss = new WebSocket.Server({ host, port });

//         wss.on("listening", () => {
//             const remote = wss.address();
//             console.log(`Server running at ${remote.address}:${remote.port}`);
//         });

//         wss.on("connection", (ws: any, req: any) => {
//             ws.ip = req.connection.remoteAddress.replace(/^.*:/, "");
//             const info = `new client: ${ws.ip}`;
//             console.log(info);

//             ws.isAlive = true;
//             ws.on("pong", () => (ws.isAlive = true));

//             wss.clients.forEach((client: any) => {
//                 if (client !== ws) client.send(info);
//             });

//             ws.on("message", (message: any) => this.broadcast(message, ws, wss));
//             ws.on("close", () => {
//                 const info = `client ${ws.ip} disconnected`;
//                 console.log(info);

//                 wss.clients.forEach((ws: any) => ws.send(info));
//             });
//         });

//         setInterval(() => {
//             wss.clients.forEach((ws: any) => {
//                 if (ws.isAlive === false) return ws.terminate();

//                 ws.isAlive = false;
//                 ws.ping();
//             });
//         }, 1000);
//     },

//     broadcast: function (message: any, sender: any, wss: any) {
//         const payload = `[${sender.ip}] > ${message}`;
//         console.log(payload);

//         wss.clients.forEach((ws: any) => ws.send(payload));
//     },
// };

// chat.run("192.168.100.2", 3000);
// module.exports = chat;

// ======================================== 

// ========================================
// const WebSocket = require('ws');
const chat = {
    run: function (host: any, port: any) {
        const wss = new WebSocket.Server({ host, port });
        // const wss = new WebSocket.Server({ port: 3001 });

        let sent = 0;
        let replied = 0;

        // Print the number of sent and replied every 10 seconds
        setInterval(() => {
            console.log(`Sent: ${sent}, Replied: ${replied}`)
        }, 10000);

        wss.on('connection', function connection(ws: any, req: any) {
            console.log("New connection:", req.connection.remoteAddress);

            // Every 100ms, we send a message to the arduino
            setInterval(() => {
                sent += 1;
                ws.send(JSON.stringify({ type: "message", data: sent }))
            }, 100)

            // Everytime we receive the reply, we keep track of it
            ws.on('message', function incoming(message: any) {
                console.log("Received:", message);
                replied += 1;
            });
        });
    }
}

// chat.run("192.168.100.2", 3001);
// module.exports = chat;
// ===============================
// const app2 = require('express')();
// const appWs = require('express-ws')(app);

// app2.ws('/echo', (ws: any) => {
//     ws.on('message', (msg: any) => {
//         console.log('Received: ', msg);
//         ws.send(msg);
//     });
// });

// app2.listen(1337, () => console.log('Server has been started'));
// ===========================
module.exports = app;