import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ chess, board, socket, setBoard, playerColor }: {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
    socket: WebSocket;
    playerColor: string | null; // Receive prop
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
                                    // 1. GATEKEEPER: Check if it's the user's turn
                                    const turn = chess.turn(); // 'w' or 'b'
                                    const isMyTurn = (turn === 'w' && playerColor === 'white') || 
                                                     (turn === 'b' && playerColor === 'black');

                                    if (!isMyTurn) return; // Block click if not their turn

                                    if (!from) {
                                        // 2. GATEKEEPER: Only allow selecting their own pieces
                                        if (square) {
                                            const isMyPiece = (square.color === 'w' && playerColor === 'white') || 
                                                              (square.color === 'b' && playerColor === 'black');
                                            
                                            if (isMyPiece) {
                                                setFrom(squareRep);
                                            }
                                        }
                                    } else {
                                        try {
                                            const moveResult = chess.move({
                                                from,
                                                to: squareRep,
                                                promotion: 'q'
                                            });

                                            if (moveResult) {
                                                setBoard(chess.board());
                                                socket.send(JSON.stringify({
                                                    type: MOVE,
                                                    payload: { move: { from, to: squareRep } }
                                                }));
                                            }
                                        } catch (error) {
                                            console.log("Invalid move attempt");
                                        }
                                        setFrom(null);
                                    }
                                }}
                                    key={j}
                                    className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-600 to-pink-600 rounded-lg'} flex items-center justify-center cursor-pointer ${from === squareRep ? 'border-4 border-yellow-400' : ''}`}
                                >
                                    <div className="w-full justify-center flex">
                                        {square && (
                                            <img
                                                className="w-8 h-8" 
                                                src={getPieceImage(square.color, square.type)}
                                                alt="piece"
                                            />
                                        )}
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