import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ chess, board, socket, setBoard }: {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<null | Square>(null)

    const getPieceImage = (color: Color, type: PieceSymbol) => {
        const colorPrefix = color === 'w' ? 'w' : 'b'; 
        return `/${colorPrefix}${type.toLowerCase()}.png`; 
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="text-white-200">
                {board.map((row, i) => (
                    <div key={i} className="flex">
                        {row.map((square, j) => {
                            const squareRep = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                            
                            return (
                                <div onClick={() => {
                                    if (!from) {
                                        // Only allow selecting a square if it contains a piece
                                        if (square) {
                                            setFrom(squareRep);
                                        }
                                    } else {
                                        // Attempt the move locally first to validate legallity
                                        try {
                                            const moveResult = chess.move({
                                                from,
                                                to: squareRep,
                                                promotion: 'q' // Default auto-promotion to Queen for simplicity
                                            });

                                            if (moveResult) {
                                                // Move is valid! Sync state and alert backend
                                                setBoard(chess.board());
                                                socket.send(JSON.stringify({
                                                    type: MOVE,
                                                    payload: {
                                                        move: {
                                                            from,
                                                            to: squareRep
                                                        }
                                                    }
                                                }));
                                            } else {
                                                alert("Move not allowed! Try a legal move.");
                                            }
                                        } catch (error) {
                                            // chess.js throws errors for completely invalid moves
                                            alert("Move not allowed! Try a legal move.");
                                        }
                                        
                                        // Always reset selection, allowing player to try again
                                        setFrom(null);
                                    }
                                }}
                                    key={j}
                                    className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-600 to-pink-600 rounded-lg shadow-lg opacity-100 transform '} flex items-center justify-center text-xl font-bold text-white cursor-pointer ${from === squareRep ? 'border-4 border-yellow-400' : ''}`}
                                >
                                    <div className="w-full justify-center flex">
                                         <div className="h-full justify-center flex flex-col">
                                                {square && square.type ? (
                                                    <img
                                                        className="w-8 h-8" 
                                                        src={getPieceImage(square.color, square.type)}
                                                        alt={`${square.color}${square.type}`}
                                                    />
                                                ) : null}
                                            </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
