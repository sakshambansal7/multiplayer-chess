import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const establishConnection = async () => {
            let userId = localStorage.getItem("chess_user_id");

            // If the key is missing, or accidentally saved as the string "null"
            if (!userId || userId === "null") {
                try {
                    // Force generate a valid guest ID from your Express endpoint
                    const response = await fetch("http://localhost:8080/api/auth/guest", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    });
                    const data = await response.json();
                    
                    userId = data.userId;
                    localStorage.setItem("chess_user_id", data.userId);
                    localStorage.setItem("chess_username", data.username);
                } catch (error) {
                    console.error("Failed to generate fallback user identity:", error);
                    return; // Abort connection if backend API is offline
                }
            }

            // Establish the socket connection with a guaranteed, valid ID
            const ws = new WebSocket(`${WS_URL}?userId=${userId}`);

            ws.onopen = () => {
                console.log(`WebSocket connected with true ID: ${userId}`);
                setSocket(ws);
            };

            ws.onclose = () => {
                console.log("WebSocket disconnected.");
                setSocket(null);
            };

            ws.onerror = (err) => {
                console.error("WebSocket connection error:", err);
            };

            return ws;
        };

        let activeWs: WebSocket | undefined;
        establishConnection().then(ws => {
            if (ws) activeWs = ws;
        });

        // Cleanup function to close the correct socket reference
        return () => {
            if (activeWs) activeWs.close();
        };
    }, []);

    return socket;
};