import { Router } from "express";
import { getAllOrders, getAllUsers } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.route("/users").get(verifyJWT, verifyAdmin, getAllUsers);
router.route("/orders").get(verifyJWT, verifyAdmin, getAllOrders);

export default router;
