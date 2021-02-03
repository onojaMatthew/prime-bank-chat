import Room from "../model/room.js";

export const joinRoom = async (room) => {
  try {
    let rum = await Room.findOne({ name: room });
    if (rum) return;
    let newRoom = new Room({ name: room });
    newRoom = await newRoom.save();
    if (!newRoom) return { error: "Could not join room. Please try again" };
    return { newRoom };
  } catch (error) {
    return { error: error.message };
  }
}

export const deleteRoom = async (roomId) => {
  try {
    let deletedRoom = await Room.findByIdAndDelete({ _id: roomId });
    if (!deletedRoom) return { error: "Failed leave room" }
    return { message: "You left the chat" }
  } catch (error) {
    return { error: error.message };
  }
}