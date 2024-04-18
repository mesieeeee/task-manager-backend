import express from "express";
import { register } from "../server/controller/userController.js";
import { login } from "../server/controller/userController.js";
import { logout } from "../server/controller/userController.js";
import { myProfile } from "../server/controller/userController.js";
import { isAuthenticated } from "../server/middlewares/auth.js";
const router = express.Router();

router.post("/login", login);
router.get('/logout', isAuthenticated, logout);
router.get("/me", isAuthenticated, myProfile);
router.post("/register", register);

export default router;