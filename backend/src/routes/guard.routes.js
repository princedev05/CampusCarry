import { Router } from "express";
import {
  getPendingDeliveries,
  acceptDeliveryRequest,
  verifyDeliveryArrival,
  handoverParcel,
} from "../controllers/guard.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyGuard } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  acceptDeliveryValidator,
  verifyDeliveryValidator,
  handoverValidator,
} from "../validators/index.js";

const router = Router();

router.route("/deliveries").get(verifyJWT, verifyGuard, getPendingDeliveries);

router
  .route("/accept-delivery")
  .post(verifyJWT, verifyGuard, acceptDeliveryValidator(), validate, acceptDeliveryRequest);

router
  .route("/verify-delivery")
  .post(verifyJWT, verifyGuard, verifyDeliveryValidator(), validate, verifyDeliveryArrival);

router
  .route("/handover")
  .post(verifyJWT, verifyGuard, handoverValidator(), validate, handoverParcel);

export default router;
