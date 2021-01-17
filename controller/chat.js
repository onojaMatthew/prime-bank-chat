import Chat from "../model/chat.js";

export const newChat = async (data) => {
  console.log(data, " inside chat controller")
  if (!data) return { error: "Either message or room name or username not provided" };
  try {

    let newChat = new Chat({ message: data.chat, room: data.room, username: data.username });
    console.log(newChat, "the new chat")
    newChat = await newChat.save();
    return { message: newChat };
  } catch (error) {
    return { error: error.message }
  }
}

export const getUserChats = async (req, res) => {
  const { room } = req.body;
  if (!room) return res.statuss(400).json({ error: "Missing parameter: Room" });
  try {
    let chats = await Chats.find({ room: req.body.room }).populate("room");
    if (!chats) return res.status(404).json({ error: "Empty chat" });
    return res.json(chats);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export const chatRead = async (chatId) => {
  if (!chatId) return { error: "Missing parameter: chatId" };

  try {
    let chat = await Chat.findByIdAndUpdate({ _id: chatId }, { $set: { isRead: true }}, { new: true })
    if (!chat) return { error: "Chat does not exist" };
    return { message: "Chat seen" };
  } catch (error) { 
    return { errorr: error.message };
  }
} 