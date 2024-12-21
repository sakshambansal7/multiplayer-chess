

import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { MOVE, GAME_OVER, INIT_GAME } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;
    private moveCount: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.moveCount = 0;

        // Notify both players about their colors
        this.player1.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "white",
                },
            })
        );
        this.player2.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "black",
                },
            })
        );
    }

    makeMove(socket: WebSocket,
         move:
          { from: string; 
            to: string 
        }) {

            console.log(move)
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

            if (!result) throw new Error("Invalid move");
        } catch (e) {
            console.error("Move error:", e instanceof Error ? e.message : "Unknown error");
            return;
        }

        // Check for game over conditions
        if (
            this.board.isCheckmate() ||
            this.board.isStalemate() ||
            this.board.isDraw() ||
            this.board.isInsufficientMaterial() ||
            this.board.isThreefoldRepetition()
        ) {
            const winner = this.board.isCheckmate()
                ? this.board.turn() === "w"
                    ? "black"
                    : "white"
                : "draw";

            // Notify both players about the game result
            this.player1.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner,
                    },
                })
            );
            this.player2.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner,
                    },
                })
            );
            return;
        }

        // Notify the opponent about the move
        if (this.moveCount % 2 === 0) {
            this.player2.send(
                JSON.stringify({
                    type: MOVE,
                    payload: move,
                })
            );
        } else {
            this.player1.send(
                JSON.stringify({
                    type: MOVE,
                    payload: move,
                })
            );
        }

        this.moveCount++;
    }
}

