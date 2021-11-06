import express, { Request, Response, Application } from 'express';
import http from 'http';

import { Server } from 'socket.io';

const app: Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const io = new Server(server);

app.get("/", (req: Request, res: Response): void => {
    res.send('Hello Typescript with Node.js!')
});

io.on('connection', (socket) => {
    console.log('connection with socket: ', socket);
    socket.on('disconnect', () => {
        io.emit('users-changed', { user: socket, event: 'left' });
    });

    let previousId: string;

    // const safeJoin = (currentId: string) => {
    //     socket.leave(previousId);
    //     socket.join(currentId);
    //     previousId = currentId;
    // };

    // socket.on('set-nickname', (nickname) => {
    //     socket.id = nickname
    //     io.emit('users-changed', { user: nickname, event: 'joined' });
    // });

    socket.on('chat message', (msg) => {
        io.emit('message', { text: msg.text, from: socket.id, created: new Date() });
    });

    socket.on('add-message', (msg) => {
        io.emit('message', { text: msg.text, from: socket.id, created: new Date() });
    });

    socket.broadcast.emit('hi');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(PORT, (): void => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
});