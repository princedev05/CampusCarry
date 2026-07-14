import { User } from "../models/user.models.js";
import { Order } from "../models/order.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({})
    .select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find({})
    .populate("student", "fullName username email role")
    .populate("tokenNumber", "tokenNumber isAvailable assignedAt")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export { getAllUsers, getAllOrders };
