import express from "express";
import { getUsers, Login, logout, Register } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";


const router = express.Router()

router.get("/users", getUsers)
router.post("/users", Register)
router.get("/login", Login)
router.get("/token", refreshToken)
router.delete("/logout", logout)


export default router