import { Token } from "../models/token.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Order } from "../models/order.models.js";
import {
  claimAvailableToken,
  freeToken,
} from "./token.controllers.js";

// Get Pending Deliveries
const getPendingDeliveries = asyncHandler(async (req, res) => {
  const deliveries = await Order.find({
    status: { $in: ["pending", "arrived", "verified", "token_assigned", "completed"] },
  })
    .populate("student", "fullName username email")
    .populate("tokenNumber");

  return res
    .status(200)
    .json(new ApiResponse(200, deliveries, "Pending deliveries fetched"));
});

// Accept Delivery Request
const acceptDeliveryRequest = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate(
    "student",
    "fullName username email",
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status !== "pending") {
    throw new ApiError(400, "Only pending requests can be accepted");
  }

  order.status = "arrived";
  order.arrivalDate = order.arrivalDate || new Date();
  await order.save();

  const refreshedOrder = await Order.findById(order._id)
    .populate("student", "fullName username email")
    .populate("tokenNumber");

  return res
    .status(200)
    .json(new ApiResponse(200, refreshedOrder, "Delivery request accepted"));
});

// Verify Delivery Arrival
const verifyDeliveryArrival = asyncHandler(async (req, res) => {
  const { trackingId, otp } = req.body;

  const order = await Order.findOne({
    trackingId,
    deliveryOtp: otp,
    status: "arrived",
  }).populate("student", "fullName username email");

  if (!order) {
    const existingOrder = await Order.findOne({ trackingId }).populate(
      "student",
      "fullName username email",
    );

    if (!existingOrder) {
      throw new ApiError(404, "Order not found with this tracking ID");
    }

    if (existingOrder.deliveryOtp !== otp) {
      throw new ApiError(400, "Invalid OTP for this order");
    }

    if (existingOrder.status !== "arrived") {
      throw new ApiError(
        400,
        `Order must be in 'arrived' status. Current status: ${existingOrder.status}`,
      );
    }

    throw new ApiError(404, "Invalid tracking ID or OTP");
  }

  if (!order.arrivalDate) {
    order.arrivalDate = new Date();
  }

  try {
    const assignedToken = await claimAvailableToken(order._id, req.user ? req.user._id : null);

    order.status = "token_assigned";
    order.verifiedByGuard = req.user ? req.user._id : null;
    order.tokenNumber = assignedToken._id;

    await order.save();

    const refreshedOrder = await Order.findById(order._id)
      .populate("student", "fullName username email")
      .populate("tokenNumber");

    return res.status(200).json(
      new ApiResponse(
        200,
        { order: refreshedOrder, token: assignedToken },
        "Delivery verified successfully",
      ),
    );
  } catch (error) {
    console.error("Error in verifyDeliveryArrival:", error);
    throw error;
  }
});

// Handover Parcel
const handoverParcel = asyncHandler(async (req, res) => {
  const { trackingId, username, token } = req.body;

  const delivery = await Order.findOne({ trackingId })
    .populate("student", "fullName username email")
    .populate("tokenNumber");

  if (!delivery) {
    throw new ApiError(404, "Delivery not found with this tracking ID");
  }

  if (delivery.status !== "token_assigned") {
    throw new ApiError(
      400,
      `Only token assigned deliveries can be handed over. Current status: ${delivery.status}`,
    );
  }

  // Verify username matches
  if (!delivery.student) {
    throw new ApiError(400, "Student information not found for this order");
  }

  if (delivery.student.username !== username) {
    throw new ApiError(400, `Username does not match. Expected: ${delivery.student.username}`);
  }

  // Verify token matches
  const parsedToken = Number(token);

  if (!Number.isFinite(parsedToken)) {
    throw new ApiError(400, "Token must be a valid number");
  }

  if (!delivery.tokenNumber) {
    throw new ApiError(400, "No token assigned to this delivery");
  }

  if (delivery.tokenNumber.tokenNumber !== parsedToken) {
    throw new ApiError(400, `Invalid token. Expected: ${delivery.tokenNumber.tokenNumber}`);
  }

  // Verify token is available (assigned to this order)
  if (delivery.tokenNumber.assignedOrder?.toString() !== delivery._id.toString()) {
    throw new ApiError(400, "Token is not assigned to this delivery");
  }

  try {
    // Free the token (mark as available again for next use)
    await freeToken(delivery.tokenNumber._id);

    delivery.status = "completed";
    delivery.collectedAt = new Date();
    delivery.verifiedByGuard = req.user ? req.user._id : null;

    await delivery.save();

    const refreshedDelivery = await Order.findById(delivery._id)
      .populate("student", "fullName username email")
      .populate("tokenNumber");

    return res
      .status(200)
      .json(new ApiResponse(200, refreshedDelivery, "Parcel handed over successfully"));
  } catch (error) {
    console.error("Error in handoverParcel:", error);
    throw new ApiError(500, `Failed to handover parcel: ${error.message}`);
  }
});

export {
  getPendingDeliveries,
  acceptDeliveryRequest,
  verifyDeliveryArrival,
  handoverParcel,
};
