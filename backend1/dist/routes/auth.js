"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/auth.ts
const express_1 = require("express");
const User_1 = require("../Models/User");
const router = (0, express_1.Router)();
router.post('/auth/guest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate a recognizable default guest name
        const uniqueGuestName = `Grandmaster_${Math.floor(1000 + Math.random() * 9000)}`;
        const newGuest = new User_1.User({
            username: uniqueGuestName
        });
        yield newGuest.save();
        res.status(201).json({
            userId: newGuest._id,
            username: newGuest.username
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to establish player identity record." });
    }
}));
exports.default = router;
