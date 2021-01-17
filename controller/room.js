import Room from "../model/room.js";

export const joinRoom = async (room) => {
  console.log(room, "this is the room")
  try {
    let rum = await Room.findOne({ name: room });
    console.log(rum, "existing room")
    if (rum) return;
    let newRoom = new Room({ name: room });
    newRoom = await newRoom.save();
    console.log(newRoom, " new room")
    if (!newRoom) return { error: "Could not join room. Please try again" };
    console.log(newRoom, "the new room")
    return { newRoom };
  } catch (error) {
    return { error: error.message };
  }
}

export const deleteRoom = async (roomId) => {
  console.log(roomId, "id of room to delete")
  try {
    let deletedRoom = await Room.findByIdAndDelete({ _id: roomId });
    console.log(deletedRoom, "the deleted room")
    if (!deletedRoom) return { error: "Failed leave room" }
    return { message: "You left the chat" }
  } catch (error) {
    return { error: error.message };
  }
}