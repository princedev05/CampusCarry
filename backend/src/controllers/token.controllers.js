import { Token } from "../models/token.models.js";
import { Order } from "../models/order.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

// Initialize token pool (1-100) - call this once during server startup
const initializeTokenPool = async () => {
  try {
    // Seed missing token numbers without touching already assigned tokens.
    for (let tokenNumber = 1; tokenNumber <= 100; tokenNumber++) {
      await Token.updateOne(
        { tokenNumber },
        {
          $setOnInsert: {
            tokenNumber,
            isAvailable: true,
            assignedOrder: null,
            assignedByGuard: null,
            assignedAt: null,
          },
        },
        { upsert: true },
      );
    }

    // Remove out-of-range tokens if they exist.
    await Token.deleteMany({
      $or: [{ tokenNumber: { $lt: 1 } }, { tokenNumber: { $gt: 100 } }],
    });

    const totalTokens = await Token.countDocuments({ tokenNumber: { $gte: 1, $lte: 100 } });
    console.log(`✓ Token pool ready: ${totalTokens} tokens (1-100)`);
  } catch (error) {
    console.error("Error initializing token pool:", error.message);
  }
};

// Get an available token from the pool
const getAvailableToken = async () => {
  const availableToken = await Token.findOne({
    isAvailable: true,
    assignedOrder: null,
  });

  if (!availableToken) {
    throw new ApiError(503, "No tokens available. All tokens are currently assigned. Please try again later.");
  }

  return availableToken;
};

// Assign a token to an order
const assignTokenToOrder = async (token, orderId, guardId) => {
  token.isAvailable = false;
  token.assignedOrder = orderId;
  token.assignedByGuard = guardId;
  token.assignedAt = new Date();
  await token.save();
  return token;
};

// Free a token after handover
const freeToken = async (tokenId) => {
  const token = await Token.findById(tokenId);
  if (token) {
    token.isAvailable = true;
    token.assignedOrder = null;
    token.assignedByGuard = null;
    token.assignedAt = null;
    await token.save();
  }
};

const claimAvailableToken = async (orderId, guardId) => {
  const claimedToken = await Token.findOneAndUpdate(
    {
      isAvailable: true,
      assignedOrder: null,
      tokenNumber: { $gte: 1, $lte: 100 },
    },
    {
      $set: {
        isAvailable: false,
        assignedOrder: orderId,
        assignedByGuard: guardId || null,
        assignedAt: new Date(),
      },
    },
    {
      new: true,
      sort: { tokenNumber: 1 },
    },
  );

  if (!claimedToken) {
    throw new ApiError(503, "No tokens available. All tokens are currently assigned. Please try again later.");
  }

  return claimedToken;
};

// Generate Pickup Token
const generatePickupToken = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate("tokenNumber");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.tokenNumber) {
    return res
      .status(200)
      .json(new ApiResponse(200, order.tokenNumber, "Pickup token already generated"));
  }

  try {
    const assignedToken = await claimAvailableToken(orderId, req.user?._id);

    order.tokenNumber = assignedToken._id;
    order.status = "token_assigned";
    if (!order.arrivalDate) {
      order.arrivalDate = new Date();
    }

    await order.save();

    const refreshedOrder = await Order.findById(order._id).populate("tokenNumber");

    return res
      .status(201)
      .json(new ApiResponse(201, { token: assignedToken, order: refreshedOrder }, "Pickup token generated"));
  } catch (error) {
    console.error("Error in generatePickupToken:", error);
    throw error;
  }
});

// Verify Token
const verifyPickupToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const parsedToken = Number(token);
  if (!Number.isFinite(parsedToken)) {
    throw new ApiError(400, "Token must be a valid number");
  }

  const tokenDoc = await Token.findOne({ tokenNumber: parsedToken }).populate({
    path: "assignedOrder",
    populate: {
      path: "student",
      select: "fullName username email",
    },
  });

  if (!tokenDoc) {
    throw new ApiError(404, "Invalid token");
  }

  if (!tokenDoc.assignedOrder) {
    throw new ApiError(400, "Token is not assigned to any delivery");
  }

  if (tokenDoc.assignedOrder.status === "completed") {
    throw new ApiError(400, "Token has already been used for delivery");
  }

  // Token verification just confirms it's valid
  // Actual handover happens in guard handover endpoint

  return res
    .status(200)
    .json(new ApiResponse(200, tokenDoc, "Token verified successfully"));
});

export {
  initializeTokenPool,
  getAvailableToken,
  assignTokenToOrder,
  claimAvailableToken,
  freeToken,
  generatePickupToken,
  verifyPickupToken,
};
