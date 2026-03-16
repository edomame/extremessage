import Channel from "../models/Channel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;

    // Always include the creator in the channel
    const allMembers = [...new Set([req.userId, ...members])];

    const channel = await Channel.create({
      name: name || null,
      members: allMembers,
    });

    res.status(201).json(channel);
  } catch (error) {
    console.error("Create channel error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ members: req.userId })
      .populate("members", "username");

    res.status(200).json(channels);
  } catch (error) {
    console.error("Get channels error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const leaveChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (!channel.members.includes(req.userId)) {
      return res.status(403).json({ message: "You are not in this channel" });
    }

    channel.members = channel.members.filter(
      (m) => m.toString() !== req.userId
    );
    await channel.save();

    res.status(200).json({ message: "Left channel successfully" });
  } catch (error) {
    console.error("Leave channel error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
