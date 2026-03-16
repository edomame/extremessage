import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
{
  content:   { type: String, required: true, maxlength: 1000 },
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  channel:   { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
},
{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
