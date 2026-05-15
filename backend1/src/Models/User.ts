import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    currentGameId: { type: String, default: null },
    lastSeen: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);