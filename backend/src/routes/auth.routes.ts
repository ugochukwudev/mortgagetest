import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateSession } from "../middleware/session.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const router = Router();

router.post(
	"/register",
	asyncHandler(AuthController.register.bind(AuthController))
);
router.post("/login", asyncHandler(AuthController.login.bind(AuthController)));
router.post(
	"/logout",
	authenticate,
	validateSession,
	asyncHandler(AuthController.logout.bind(AuthController))
);
router.get(
	"/me",
	authenticate,
	validateSession,
	asyncHandler(AuthController.getMe.bind(AuthController))
);

export default router;
