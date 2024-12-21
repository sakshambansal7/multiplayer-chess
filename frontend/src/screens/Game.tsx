import { ChessBoard } from "../components/ChessBoard";
import { Button } from "../components/Button";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";


// Todo :Move together . there's code repetition here
export const INIT_GAME="init_game";
export const MOVE="move";
export const GAME_OVER="GAME_OVER";




export const Game = () => {
    const socket=useSocket();
    const [chess,setChess] = useState(new Chess())
    const [board,setBoard] = useState(chess.board())
    const[started,setStarted]=useState(false)

    useEffect(
         () => {
            if(!socket){
                return;
            }
            socket. onmessage = (event) => {
                const message = JSON. parse(event.data);
                console.log (message);
                switch (message.type) {
                case INIT_GAME:
                    // setChess(new Chess());
                setBoard(chess.board());
                setStarted(true)
                break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                console. log ("Move made");
                break;
                case GAME_OVER:
                console. log ("Game over");
                break;
                }
                }
    },[socket])


        if(!socket) return <div>connecting...</div>;


    return (
        <div className="flex flex-col items-center justify-center m-0 w-screen h-screen p-0 bg-gray-800">
            <div className="max-w-screen-lg p-4 w-full h-full">
                <div className="grid grid-cols-6 gap-4 w-full h-full ">
                    {/* ChessBoard Section */}
                    <div className="col-span-4 bg-red-200 w-full">
                        <ChessBoard  chess={chess} setBoard={setBoard} socket={socket} board={board} />
                    </div>
                    {/* Button Section */}
                    <div className="  mt-28 h-[32rem] col-span-2 flex flex-col justify-center items-center bg-gray-900">
                        <div className="pt-8">
                       {!started && <Button
                            onClick={() => {
                                socket.send(JSON.stringify({
                                    type:INIT_GAME,
                                }))


                            }}
                        >
                            Play
                        </Button>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
