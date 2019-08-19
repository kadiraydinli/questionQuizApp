import io from 'socket.io-client';

global.url = "http://192.168.1.37:3000/";

const connections = {};
export default (room, token) => {
    connections[room] = connections[room] ? connections[room] : io(global.url + room, token ? {
        query: { token: token }
    } : null);
    return connections[room];
};