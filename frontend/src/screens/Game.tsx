import { ChessBoard } from "../components/ChessBoard";
import { Button } from "../components/Button";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false); // Track if user clicked play but match hasn't started

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    setStarted(true);
                    setIsWaiting(false); // Game started, stop waiting
                    setBoard(chess.board());
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    setStarted(false);
                    setIsWaiting(false);
                    break;
            }
        };
    }, [socket, chess]);

    if (!socket) return <div className="text-white flex justify-center items-center h-screen bg-gray-800">Connecting to server...</div>;

    return (
        <div className="flex flex-col items-center justify-center m-0 w-screen h-screen p-0 bg-gray-800">
            <div className="max-w-screen-lg p-4 w-full h-full">
                <div className="grid grid-cols-6 gap-4 w-full h-full ">
                    {/* ChessBoard Section */}
                    <div className="col-span-4 w-full">
                        <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
                    </div>
                    {/* Button / Info Section */}
                    <div className="mt-28 h-[32rem] col-span-2 flex flex-col justify-center items-center bg-gray-900 rounded-lg shadow-xl">
                        <div className="pt-8">
                            {!started && !isWaiting && (
                                <Button
                                    onClick={() => {
                                        setIsWaiting(true); // Hide button immediately to prevent double submissions
                                        socket.send(JSON.stringify({ type: INIT_GAME }));
                                    }}
                                >
                                    Play
                                </Button>
                            )}
                            
                            {isWaiting && (
                                <div className="text-xl font-semibold text-yellow-400 animate-pulse">
                                    Waiting for a player to join...
                                </div>
                            )}

                            {started && (
                                <div className="text-xl font-semibold text-green-400">
                                    Match in Progress
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
