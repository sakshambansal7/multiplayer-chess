import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { initializePlayerIdentity } from "../utils/auth"; // Import your handler

export const Landing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically make sure this guest user has a record in your MongoDB
        initializePlayerIdentity();
    }, []);

    return (
        <div className="m-0 ml-0 mr-0 p-0 mx-0 my-0">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="flex justify-center mt-10">
                    <img src="chessboard.png" alt="Chessboard" className="max-w-96" />
                </div>
                <div className="mt-44 mr-32">
                    <h1 className="text-4xl font-bold text-white">Play chess online with #2 Site Best Experience! </h1>
                    <div className="mt-8 flex justify-center">
                        <Button onClick={() => {
                            navigate("/game");
                        }} >
                            play online
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};