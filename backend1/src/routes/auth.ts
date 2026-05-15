// backend/src/routes/auth.ts
import { Router } from 'express';
import { User } from '../Models/User';



const router = Router();

router.post('/auth/guest', async (req, res) => {
    try {
        // Generate a recognizable default guest name
        const uniqueGuestName = `Grandmaster_${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newGuest = new User({
            username: uniqueGuestName
        });
        
        await newGuest.save();
        
        res.status(201).json({
            userId: newGuest._id,
            username: newGuest.username
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to establish player identity record." });
    }
});

export default router;