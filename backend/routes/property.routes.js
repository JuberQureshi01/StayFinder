
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

// --- Public Routes ---
router.route("/").get(getAllProperties);
router.route("/my-properties").get(verifyJWT, getMyProperties);
router.route("/").post(verifyJWT, upload.array('images', 10), createProperty);
router.route("/:propertyId/coordinates").get(getPropertyCoordinates);
router.route("/host/:propertyId").get(verifyJWT, getPropertyByIdForHost);
router.route("/:propertyId").get(getPropertyById);

router.route("/:propertyId")
    .patch(verifyJWT, upload.array('images', 10), updateProperty)
    .delete(verifyJWT, deleteProperty);

export default router;
