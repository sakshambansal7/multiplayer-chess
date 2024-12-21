import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({chess,board, socket,  setBoard }: {
    chess:any;
    setBoard:any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<null | Square>(null)
    const [to, setTo] = useState<null | Square>(null)


    // Function to get the image source for the chess piece
    const getPieceImage = (color: Color, type: PieceSymbol) => {
        const colorPrefix = color === 'w' ? 'w' : 'b'; // 'w' for white, 'b' for black
        return `/${colorPrefix}${type.toLowerCase()}.png`; // Correctly using lowercase for the image name
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="text-white-200">
                {board.map((row, i) => (
                    <div key={i} className="flex">
                        {row.map((square, j) => (
                            <div onClick={() => {
                                const squareRep =String.fromCharCode(97+(j%8))+ "" + (8-i) as Square;
                                console.log(squareRep);
                                if (!from) {
                                    setFrom(squareRep);
                                    // square?.square?? null
                                } else {
                                    // setTo(square?.square?? null);
                                    socket.send(JSON.stringify({
                                        type: MOVE,
                                    payload: {move: {
                                            from, 
                                            to:squareRep
                                        }}
                                    }))
                                    
                                    setFrom(null)
                                    chess.move(
                                        {
                                            from, 
                                            to:squareRep
                                        }
                                    );
                                    setBoard(chess.board())
                                    console.log({
                                        from,
                                        to:squareRep
                                    })
                                }

                            }}
                                key={j}
                                className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-600 to-pink-600 rounded-lg shadow-lg opacity-100 transform '
                                    } flex items-center justify-center text-xl font-bold text-white`}
                            >
                                <div className="w-full justify-center flex">
                                     <div className="h-full justify-center flex flex-col">
                                            {square && square.type ? (
                                                <img
                                                    className="w-8 h-8" // Adjust image size as needed
                                                    src={getPieceImage(square.color, square.type)}
                                                    alt={`${square.color}${square.type}`}
                                                />
                                            ) : null}
                                        </div>
                                </div>
                            </div>

                        ))}
                    </div>
                ))}
            </div>
        </div>
        
    );
};








// import { Chess, Color, PieceSymbol, Square } from "chess.js";
// import { useState } from "react";
// import { MOVE } from "../screens/Game";

// export const ChessBoard = ({ chess, board, socket, setBoard }: {
//     chess: any;
//     setBoard: any;
//     board: ({
//         square: Square;
//         type: PieceSymbol;
//         color: Color;
//     } | null)[][];
//     socket: WebSocket;
// }) => {
//     const [from, setFrom] = useState<null | Square>(null);
//     const [to, setTo] = useState<null | Square>(null);

//     // Function to get the image source for the chess piece
//     const getPieceImage = (color: Color, type: PieceSymbol) => {
//         const colorPrefix = color === 'w' ? 'w' : 'b'; // 'w' for white, 'b' for black
//         return `/${colorPrefix}${type.toLowerCase()}.png`; // Correctly using lowercase for the image name
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-800">
//             <div className="text-white-200">
//                 {board.map((row, i) => (
//                     <div key={i} className="flex">
//                         {row.map((square, j) => {
//                             // The square position is derived from the row and column
//                             const squareRep = String.fromCharCode(97 + j) + (8 - i) as Square;

//                             return (
//                                 <div
//                                     key={j}
//                                     onClick={() => {
//                                         if (!from) {
//                                             setFrom(squareRep); // Set the "from" square
//                                         } else {
//                                             // Handle the move from `from` to `squareRep`
//                                             socket.send(
//                                                 JSON.stringify({
//                                                     type: MOVE,
//                                                     payload: {
//                                                         move: {
//                                                             from,
//                                                             to: squareRep
//                                                         }
//                                                     }
//                                                 })
//                                             );

//                                             chess.move({ from, to: squareRep });
//                                             setBoard(chess.board());
//                                             setFrom(null); // Reset after move
//                                         }
//                                     }}
//                                     className={`w-16 h-16 ${((i + j) % 2 === 0 ? 'bg-gray-900' : 'bg-gradient-to-b from-purple-600 to-pink-600') + ' rounded-lg shadow-lg opacity-100 transform'} flex items-center justify-center text-xl font-bold text-white`}
//                                 >
//                                     <div className="w-full justify-center flex">
//                                         <div className="h-full justify-center flex flex-col">
//                                             {square && square.type ? (
//                                                 <img
//                                                     className="w-8 h-8" // Adjust image size as needed
//                                                     src={getPieceImage(square.color, square.type)}
//                                                     alt={`${square.color}${square.type}`}
//                                                 />
//                                             ) : null}
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

