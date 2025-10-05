import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, updateUserAvatar,logoutUser, updateUserProfile } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/profile", verifyJWT, updateUserProfile);
router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.post("/logout", verifyJWT, logoutUser);

export default router;


