import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import channelRoutes from "./routes/channels.js";
import messageRoutes from "./routes/messages.js";
import userRoutes from "./routes/users.js";
import Message from "./models/Message.js";
import Channel from "./models/Channel.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8747;

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a channel room
  socket.on("join-channel", (channelId) => {
    socket.join(channelId);
    console.log(`${socket.id} joined channel ${channelId}`);
  });

  // User leaves a channel room
  socket.on("leave-channel", (channelId) => {
    socket.leave(channelId);
    console.log(`${socket.id} left channel ${channelId}`);
  });

  // User sends a message
  socket.on("send-message", async ({ channelId, userId, content }) => {
    try {
      if (!content || content.trim() === "") return;

      const channel = await Channel.findById(channelId);
      if (!channel || !channel.members.includes(userId)) return;

      const message = await Message.create({
        content: content.trim(),
        sender: userId,
        channel: channelId,
      });

      await message.populate("sender", "username");

      // Broadcast to everyone in the channel including sender
      io.to(channelId).emit("receive-message", message);
    } catch (error) {
      console.error("Socket message error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
