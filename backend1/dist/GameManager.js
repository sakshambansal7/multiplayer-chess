"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
//user,Game
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.Users = [];
    }
    addUser(socket) {
        this.Users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.Users = this.Users.filter(user => user !== socket);
        // stop the game bcz the user left
    }
    addHandler(socket) {
        console.log("add handler tk chal rha hai");
        socket.on("message", (data) => {
            console.log("message tk aya hai");
            // using grpc if want
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                // console.log("1 new  pendig user created" )
                if (this.pendingUser) {
                    console.log("old pendig user ke sath join hona hai");
                    const game = new Game_1.Game(this.pendingUser, socket);
                    console.log("newgame started with pending user");
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    // console.log("2 new pendig user created")
                    this.pendingUser = socket;
                    console.log("new pendig user created");
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("inside  make move");
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
