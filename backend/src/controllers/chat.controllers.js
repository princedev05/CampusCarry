import { ChatMessage } from "../models/chat.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const buildRoomId = (studentId, guardId) => {
  return [String(studentId), String(guardId)].sort().join(":");
};

const getAvailablePeers = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  const targetRole = currentUser.role === "student" ? "guard" : currentUser.role === "guard" ? "student" : null;

  if (!targetRole) {
    return res.status(200).json(new ApiResponse(200, [], "No peers available"));
  }

  const peers = await User.find({ role: targetRole }).select("fullName username role").lean();
  return res.status(200).json(new ApiResponse(200, peers, "Peers fetched"));
});

const getChatHistory = asyncHandler(async (req, res) => {
  const { otherUserId } = req.params;
  const currentUser = req.user;

  if (!otherUserId) {
    throw new ApiError(400, "Other user id is required");
  }

  const roomId = buildRoomId(currentUser._id, otherUserId);
  const messages = await ChatMessage.find({ roomId })
    .sort({ createdAt: 1 })
    .populate("sender", "fullName username role")
    .populate("recipient", "fullName username role");

  return res.status(200).json(new ApiResponse(200, messages, "Chat history fetched"));
});

const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, content } = req.body;
  const currentUser = req.user;

  if (!recipientId || !content?.trim()) {
    throw new ApiError(400, "Recipient and message content are required");
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    throw new ApiError(404, "Recipient not found");
  }

  const roomId = buildRoomId(currentUser._id, recipientId);
  const message = await ChatMessage.create({
    roomId,
    sender: currentUser._id,
    recipient: recipient._id,
    content: content.trim(),
  });

  const populatedMessage = await message.populate("sender", "fullName username role");
  await populatedMessage.populate("recipient", "fullName username role");

  return res.status(201).json(new ApiResponse(201, populatedMessage, "Message sent"));
});

export { buildRoomId, getAvailablePeers, getChatHistory, sendMessage };
