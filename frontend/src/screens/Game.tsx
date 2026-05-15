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
    const [chess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    // State to track if you are 'white' or 'black'
    const [playerColor, setPlayerColor] = useState<string | null>(null);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME:
                    setStarted(true);
                    setIsWaiting(false);
                    setBoard(chess.board());
                    // The backend sends { payload: { color: "white" | "black" } }
                    setPlayerColor(message.payload.color); 
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    break;
                case GAME_OVER:
                    setStarted(false);
                    setIsWaiting(false);
                    break;
            }
        };
    }, [socket, chess]);

    if (!socket) return <div className="text-white flex justify-center items-center h-screen bg-gray-800">Connecting...</div>;

    return (
        <div className="flex flex-col items-center justify-center m-0 w-screen h-screen p-0 bg-gray-800">
            <div className="max-w-screen-lg p-4 w-full h-full">
                <div className="grid grid-cols-6 gap-4 w-full h-full ">
                    <div className="col-span-4 w-full">
                        <ChessBoard 
                            chess={chess} 
                            setBoard={setBoard} 
                            socket={socket} 
                            board={board} 
                            playerColor={playerColor} // Passing color here
                        />
                    </div>
                    <div className="mt-28 h-[32rem] col-span-2 flex flex-col justify-center items-center bg-gray-900 rounded-lg shadow-xl">
                        <div className="pt-8 text-center px-4">
                            {!started && !isWaiting && (
                                <Button onClick={() => {
                                    setIsWaiting(true);
                                    socket.send(JSON.stringify({ type: INIT_GAME }));
                                }}>Play</Button>
                            )}
                            
                            {isWaiting && (
                                <div className="text-xl font-semibold text-yellow-400 animate-pulse">
                                    Waiting for opponent...
                                </div>
                            )}

                            {started && (
                                <div className="text-xl font-semibold text-green-400">
                                    Match in Progress <br/>
                                    <span className="text-sm text-gray-400">Playing as {playerColor}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};