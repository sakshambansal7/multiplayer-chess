"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
const PING = "PING";
const OPPONENT_STATUS = "OPPONENT_STATUS";
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.sessions = new Map();
        setInterval(() => this.monitorHeartbeats(), 7000);
    }
    addUser(socket, userId) {
        // RECONNECTION CHECK: If user is already registered in an ongoing game
        if (this.sessions.has(userId)) {
            const existingSession = this.sessions.get(userId);
            console.log(`User ${userId} reconnected. Hot-swapping network socket links.`);
            // Clear their forfeit/cleanup countdown timer immediately
            if (existingSession.disconnectTimer) {
                clearTimeout(existingSession.disconnectTimer);
                existingSession.disconnectTimer = null;
            }
            // Bind the fresh socket reference
            existingSession.socket = socket;
            existingSession.isAlive = true;
            // Update the socket references inside the running Game object
            if (existingSession.gameInstance) {
                const game = existingSession.gameInstance;
                if (game.player1Id === userId) {
                    game.player1 = socket;
                }
                else {
                    game.player2 = socket;
                }
                // Transmit the active board layout state over the new socket connection immediately
                game.sendExistingState(socket, userId);
                // Notify opponent they returned
                const opponentSocket = game.player1Id === userId ? game.player2 : game.player1;
                try {
                    opponentSocket.send(JSON.stringify({
                        type: OPPONENT_STATUS,
                        payload: { status: "connected", message: "Opponent has reconnected!" }
                    }));
                }
                catch (e) { }
            }
            this.addHandler(socket, userId);
            return;
        }
        // Fresh login / standard join route
        this.sessions.set(userId, {
            socket,
            userId,
            isAlive: true,
            gameInstance: null,
            disconnectTimer: null
        });
        this.addHandler(socket, userId);
    }
    removeUser(socket) {
        // Lookup session via socket comparison
        let targetUserId = null;
        this.sessions.forEach((session, uId) => {
            if (session.socket === socket)
                targetUserId = uId;
        });
        if (targetUserId) {
            this.handleSocketDisconnect(targetUserId);
        }
    }
    monitorHeartbeats() {
        this.sessions.forEach((session, userId) => {
            if (!session.isAlive) {
                this.handleSocketDisconnect(userId);
                return;
            }
            session.isAlive = false;
            try {
                session.socket.send(JSON.stringify({ type: PING }));
            }
            catch (e) {
                this.handleSocketDisconnect(userId);
            }
        });
    }
    handleSocketDisconnect(userId) {
        const session = this.sessions.get(userId);
        if (!session)
            return;
        if (!session.gameInstance) {
            // Player was not in a game, safe to drop instantly
            this.sessions.delete(userId);
            if (this.pendingUser === userId)
                this.pendingUser = null;
            return;
        }
        const game = session.gameInstance;
        const opponentSocket = game.player1Id === userId ? game.player2 : game.player1;
        if (!session.disconnectTimer) {
            console.log(`Player ${userId} connection broke. Beginning 20s forfeit window.`);
            try {
                opponentSocket.send(JSON.stringify({
                    type: OPPONENT_STATUS,
                    payload: { status: "disconnected", message: "Opponent connection lost. Waiting..." }
                }));
            }
            catch (e) { }
            session.disconnectTimer = setTimeout(() => {
                console.log(`Forfeit window expired for player: ${userId}`);
                try {
                    opponentSocket.send(JSON.stringify({
                        type: "GAME_OVER",
                        payload: { winner: game.player1Id === userId ? "black" : "white" }
                    }));
                }
                catch (e) { }
                this.cleanUpGame(game);
            }, 20000);
        }
    }
    cleanUpGame(game) {
        this.games = this.games.filter(g => g !== game);
        this.sessions.delete(game.player1Id);
        this.sessions.delete(game.player2Id);
    }
    addHandler(socket, userId) {
        socket.on("message", (data) => {
            const session = this.sessions.get(userId);
            if (session)
                session.isAlive = true;
            const message = JSON.parse(data.toString());
            if (message.type === "PONG")
                return;
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser && this.pendingUser !== userId) {
                    const pendingSession = this.sessions.get(this.pendingUser);
                    if (!pendingSession) {
                        this.pendingUser = userId;
                        return;
                    }
                    // Create the match tracking identifiers
                    const game = new Game_1.Game(pendingSession.socket, socket, this.pendingUser, userId);
                    this.games.push(game);
                    pendingSession.gameInstance = game;
                    if (session)
                        session.gameInstance = game;
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = userId;
                }
            }
            if (message.type === messages_1.MOVE) {
                if (session && session.gameInstance) {
                    session.gameInstance.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
