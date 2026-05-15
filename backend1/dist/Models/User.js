"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: String,
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    currentGameId: { type: String, default: null },
    lastSeen: { type: Date, default: Date.now }
});
exports.User = mongoose_1.default.model('User', UserSchema);
