import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, updateUserAvatar,logoutUser, updateUserProfile } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateSchema } from '../middleware/middleware.js';
import { userSchema, loginSchema } from '../utils/SchemaValidation.js';
const router = Router();


router.post("/register", validateSchema(userSchema), registerUser);
router.post("/login", validateSchema(loginSchema), loginUser);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/profile", verifyJWT, updateUserProfile);
router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.post("/logout", verifyJWT, logoutUser);

export default router;


