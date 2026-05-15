"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2, player1Id, player2Id) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.moveCount = 0;
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: { color: "white" },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: { color: "black" },
        }));
    }
    sendExistingState(socket, userId) {
        const playerColor = userId === this.player1Id ? "white" : "black";
        socket.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: playerColor,
                board: this.board.board(),
                fen: this.board.fen(),
                moveCount: this.moveCount // Send the true historical count metrics down
            }
        }));
    }
    makeMove(socket, move) {
        console.log("Processing move attempt:", move);
        // Turn enforcement using absolute, immutable player variables
        const isWhitesTurn = this.moveCount % 2 === 0;
        if (isWhitesTurn && socket !== this.player1) {
            console.log("Move rejected: out of turn assignment rules (White to move).");
            return;
        }
        if (!isWhitesTurn && socket !== this.player2) {
            console.log("Move rejected: out of turn assignment rules (Black to move).");
            return;
        }
        try {
            const result = this.board.move(move);
            if (!result)
                throw new Error("Invalid move execution parameters.");
        }
        catch (e) {
            console.error("Rules exception encountered:", e instanceof Error ? e.message : e);
            return;
        }
        // Check for terminal conditions
        if (this.board.isCheckmate() ||
            this.board.isStalemate() ||
            this.board.isDraw() ||
            this.board.isInsufficientMaterial() ||
            this.board.isThreefoldRepetition()) {
            const winner = this.board.isCheckmate()
                ? this.board.turn() === "w" ? "black" : "white"
                : "draw";
            const gameOverPayload = JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: { winner },
            });
            try {
                this.player1.send(gameOverPayload);
            }
            catch (e) { }
            try {
                this.player2.send(gameOverPayload);
            }
            catch (e) { }
            return;
        }
        // Universal broadcast block to guarantee cross-window state propagation
        const moveUpdatePayload = JSON.stringify({
            type: messages_1.MOVE,
            payload: move,
        });
        try {
            this.player1.send(moveUpdatePayload);
        }
        catch (e) { }
        try {
            this.player2.send(moveUpdatePayload);
        }
        catch (e) { }
        this.moveCount++;
    }
}
exports.Game = Game;
