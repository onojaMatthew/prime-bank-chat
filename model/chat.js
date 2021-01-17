// import { Schema } from "mongoose";
import mongoose from "mongoose";

const { Schema, ObjectId } = mongoose;

const chatSchema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  room: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;