
import { Router } from 'express';
import {
    createProperty,
    getAllProperties,
    deleteProperty,
    getMyProperties,
    updateProperty,
    getPropertyById,
    getPropertyCoordinates
} from '../controllers/property.controller.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateSchema } from '../middleware/middleware.js';
import { propertySchema } from '../utils/SchemaValidation.js';

const router = Router();


router.get("/", getAllProperties);
router.get("/my-properties", verifyJWT, getMyProperties);
router.get("/:propertyId", getPropertyById);
router.get("/:propertyId/coordinates", getPropertyCoordinates);
router.post("/", verifyJWT, upload.array("images", 10), createProperty);
router.patch("/:propertyId", verifyJWT, upload.array("images", 10), updateProperty);
router.delete("/:propertyId", verifyJWT, deleteProperty);

export default router;
