// frontend/src/utils/auth.ts or place directly where appropriate
export const initializePlayerIdentity = async (): Promise<string | null> => {
    let userId = localStorage.getItem("chess_user_id");
    
    // If identity already exists locally, we don't need to do anything
    if (userId) {
        return userId;
    }

    try {
        // Hit your new Express API endpoint to generate a persistent identity record
        const response = await fetch("http://localhost:8080/api/auth/guest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Identity registration failed.");

        const data = await response.json();
        
        // Save the generated user information into local storage
        localStorage.setItem("chess_user_id", data.userId);
        localStorage.setItem("chess_username", data.username);
        
        console.log(`Registered fresh player identity: ${data.username}`);
        return data.userId;
    } catch (error) {
        console.error("Could not establish a verified user profile:", error);
        return null;
    }
};