// import { WebSocketServer } from 'ws';
// import { GameManager } from './GameManager';

// const ws = new WebSocketServer({ port: 8080 });
//     const gameManager= new GameManager();

// ws.on('connection', function connection(ws) {
//     gameManager.addUser(ws);
//     console.log("connection hogya")

//     ws.on("disconnect",()=> {
//         gameManager.removeUser(ws)
//         console.log(" user disconect hogya")
    
//     })
// });




import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });
const gameManager= new GameManager();

wss.on('connection', (ws) => {
    gameManager.addUser(ws);
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);
    });

    ws.on('close', () => {
        gameManager.removeUser(ws)
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
