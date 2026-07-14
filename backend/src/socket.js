import { Server } from "socket.io";
import { buildRoomId } from "./controllers/chat.controllers.js";
import { ChatMessage } from "./models/chat.models.js";
import { User } from "./models/user.models.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
        : "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-chat", ({ studentId, guardId }) => {
      const roomId = buildRoomId(studentId, guardId);
      socket.join(roomId);
      socket.data.roomId = roomId;
    });

    socket.on("send-message", async ({ studentId, guardId, senderId, recipientId, content }) => {
      if (!content?.trim()) return;

      const roomId = buildRoomId(studentId || senderId, guardId || recipientId);
      const sender = await User.findById(senderId);
      const recipient = await User.findById(recipientId);

      if (!sender || !recipient) return;

      const message = await ChatMessage.create({
        roomId,
        sender: sender._id,
        recipient: recipient._id,
        content: content.trim(),
      });

      const populatedMessage = await message.populate("sender", "fullName username role");
      await populatedMessage.populate("recipient", "fullName username role");

      io.to(roomId).emit("new-message", populatedMessage);
    });

    socket.on("disconnect", () => {
      socket.leave(socket.data.roomId);
    });
  });

  return io;
};

export default initializeSocket;
