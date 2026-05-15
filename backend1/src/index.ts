import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth'; // Ensure this matches your route folder structure

const app = express();
const PORT = 8080;

// 1. Mount Middleware
app.use(cors());
app.use(express.json());

// 2. Mount Identity Verification REST Routes
app.use('/api', authRouter);

// 3. Connect to your local MongoDB compass instance
mongoose.connect('mongodb://127.0.0.1:27017/chessplayers')
    .then(() => console.log('Successfully connected to local MongoDB (chessplayers)'))
    .catch((err) => console.error('Database connection error encountered:', err));

// 4. Bind Express Server to listen on Network Port
const httpServer = app.listen(PORT, () => {
    console.log(`HTTP API Server is now running on http://localhost:${PORT}`);
    console.log(`WebSocket Server is listening on ws://localhost:${PORT}`);
});

// 5. Attach WebSocket Pipeline to HTTP layer
const wss = new WebSocketServer({ server: httpServer });
const gameManager = new GameManager();

wss.on('connection', (ws, req) => {
    // Extract the identity query tracking key from handshake URL string
    const url = new URL(req.url || '', `http://localhost:${PORT}`);
    const userId = url.searchParams.get('userId');

    // Connection Gatekeeper guard condition
    if (!userId) {
        console.log('Rejected incoming anonymous websocket socket pipeline (Missing userId).');
        ws.close();
        return;
    }

    // Register active session or handle reconnection warm-swaps
    gameManager.addUser(ws, userId);
    console.log(`Client authenticated via socket pipeline. User ID: ${userId}`);

    ws.on('close', () => {
        gameManager.removeUser(ws);
        console.log(`Websocket structural pipeline closed for User ID: ${userId}`);
    });

    ws.on('error', (error) => {
        console.error('Active WebSocket pipeline anomaly:', error);
    });
});