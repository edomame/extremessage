import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
{
  name:    { type: String, required: true, maxlength: 100 },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
},
{ timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
