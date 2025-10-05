
import { Router } from 'express';
import {
    createProperty,
    getAllProperties,
    deleteProperty,
    getMyProperties,
    getPropertyByIdForHost,
    updateProperty,
    getPropertyById,
    getPropertyCoordinates
} from '../controllers/property.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();


router.get("/", getAllProperties);
router.get("/my-properties", verifyJWT, getMyProperties);
router.get("/:propertyId", getPropertyById);
router.get("/:propertyId/coordinates", getPropertyCoordinates);
router.post("/", verifyJWT, upload.array("images", 10), createProperty);
router.get("/host/:propertyId", verifyJWT, getPropertyByIdForHost);
router.patch("/:propertyId", verifyJWT, upload.array("images", 10), updateProperty);
router.delete("/:propertyId", verifyJWT, deleteProperty);

export default router;
