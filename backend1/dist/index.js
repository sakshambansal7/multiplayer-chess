"use strict";
// import { WebSocketServer } from 'ws';
// import { GameManager } from './GameManager';
Object.defineProperty(exports, "__esModule", { value: true });
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
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.GameManager();
wss.on('connection', (ws) => {
    gameManager.addUser(ws);
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log('Received:', message);
    });
    ws.on('close', () => {
        gameManager.removeUser(ws);
        console.log('Client disconnected');
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});
console.log('WebSocket server is running on ws://localhost:8080');
