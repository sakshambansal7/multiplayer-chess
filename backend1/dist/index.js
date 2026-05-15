"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth")); // Ensure this matches your route folder structure
const app = (0, express_1.default)();
const PORT = 8080;
// 1. Mount Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 2. Mount Identity Verification REST Routes
app.use('/api', auth_1.default);
// 3. Connect to your local MongoDB compass instance
mongoose_1.default.connect('mongodb://127.0.0.1:27017/chessplayers')
    .then(() => console.log('Successfully connected to local MongoDB (chessplayers)'))
    .catch((err) => console.error('Database connection error encountered:', err));
// 4. Bind Express Server to listen on Network Port
const httpServer = app.listen(PORT, () => {
    console.log(`HTTP API Server is now running on http://localhost:${PORT}`);
    console.log(`WebSocket Server is listening on ws://localhost:${PORT}`);
});
// 5. Attach WebSocket Pipeline to HTTP layer
const wss = new ws_1.WebSocketServer({ server: httpServer });
const gameManager = new GameManager_1.GameManager();
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
