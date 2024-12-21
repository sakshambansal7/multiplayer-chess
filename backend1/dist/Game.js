"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.moveCount = 0;
        // Notify both players about their colors
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        console.log(move);
        // Enforce turn rules
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }
        try {
            // Try to make the move on the board
            const result = this.board.move(move);
            if (!result)
                throw new Error("Invalid move");
        }
        catch (e) {
            console.error("Move error:", e instanceof Error ? e.message : "Unknown error");
            return;
        }
        // Check for game over conditions
        if (this.board.isCheckmate() ||
            this.board.isStalemate() ||
            this.board.isDraw() ||
            this.board.isInsufficientMaterial() ||
            this.board.isThreefoldRepetition()) {
            const winner = this.board.isCheckmate()
                ? this.board.turn() === "w"
                    ? "black"
                    : "white"
                : "draw";
            // Notify both players about the game result
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner,
                },
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner,
                },
            }));
            return;
        }
        // Notify the opponent about the move
        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
