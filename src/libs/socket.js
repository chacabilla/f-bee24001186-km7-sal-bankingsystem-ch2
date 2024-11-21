import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server);
    
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('newUserNotification', (data) => {
            console.log('New user created:', data);
            io.emit('notification', { message: `Welcome ${data.name}! Your account has been created.` });
        });

        socket.on('passwordChangedNotifications', (data) => {
            console.log('Password changed:', data);
            io.emit('notification', { message: `Your password has been successfully changed.` });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

export { io};