import Message from "../models/Message.js";
import Channel from "../models/Channel.js";

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { channelId } = req.params;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (!channel.members.includes(req.userId)) {
      return res.status(403).json({ message: "You are not in this channel" });
    }

    const message = await Message.create({
      content: content.trim(),
      sender: req.userId,
      channel: channelId,
    });

    await message.populate("sender", "username");

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (!channel.members.includes(req.userId)) {
      return res.status(403).json({ message: "You are not in this channel" });
    }

    const messages = await Message.find({ channel: channelId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
