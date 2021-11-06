import express, { Request, Response, Application } from 'express';
import http from 'http';

import { Server } from 'socket.io';

const app: Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// app.get("/", (req: Request, res: Response): void => {
//     res.send('Hello Typescript with Node.js!')
// });

io.on('connection', (socket) => {
    // console.log('connection with socket: ', socket);
    socket.on('disconnect', () => {
        io.emit('users-changed', { user: socket.id, event: 'left' });
    });

    let previousId: string;

    // const safeJoin = (currentId: string) => {
    //     socket.leave(previousId);
    //     socket.join(currentId);
    //     previousId = currentId;
    // };

    socket.on('set-name', (name) => {
        socket.id = name;
        console.log('SET NAME: ', name);
        io.emit('users-changed', { user: name, event: 'joined' });
    });

    socket.on('send-message', (msg) => {
        io.emit('message', { msg: msg.text, user: socket.id, createdAt: new Date() });
    });

    // socket.broadcast.emit('hi');
});

server.listen(PORT, (): void => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
});