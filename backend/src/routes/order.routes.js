import { Router } from "express";
import {
  createOrder,
  getStudentOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/order.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";

import { orderValidator } from "../validators/index.js";

import { verifyStudent } from "../middlewares/role.middleware.js";

const router = Router();

// Student creates delivery order 
router
  .route("/")
  .post(verifyJWT, verifyStudent, orderValidator(), validate, createOrder);

// Get all orders of logged in student 
router.route("/my-orders").get(verifyJWT, getStudentOrders);

// Get single order 
router.route("/:orderId").get(verifyJWT, getOrderById);

// Cancel order 
router.route("/:orderId").delete(verifyJWT, cancelOrder);

export default router;
