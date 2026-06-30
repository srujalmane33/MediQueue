import { Server } from "socket.io";

let io;
const activeSockets = new Map(); // maps userId -> socket.id

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Production-ready configurations can override this
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Map user to socket
    socket.on("join-user", (userId) => {
      activeSockets.set(userId, socket.id);
      socket.join(userId);
      console.log(`👤 User ${userId} registered socket ${socket.id}`);
    });

    // Join doctor queue updates room
    socket.on("join-doctor-queue", (doctorId) => {
      socket.join(`doctor-queue-${doctorId}`);
      console.log(`🩺 Socket ${socket.id} watching doctor: ${doctorId}`);
    });

    // Leave doctor queue updates room
    socket.on("leave-doctor-queue", (doctorId) => {
      socket.leave(`doctor-queue-${doctorId}`);
      console.log(`🩺 Socket ${socket.id} stopped watching doctor: ${doctorId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      // Remove from map
      for (const [userId, socketId] of activeSockets.entries()) {
        if (socketId === socket.id) {
          activeSockets.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Send event to specific user
export const emitToUser = (userId, eventName, data) => {
  if (io) {
    io.to(userId).emit(eventName, data);
  }
};

// Emit live queue updates to all patients watching a doctor
export const emitQueueUpdate = (doctorId, data) => {
  if (io) {
    io.to(`doctor-queue-${doctorId}`).emit("queue-updated", data);
  }
};

// Broadcast doctor status changes
export const emitDoctorAvailability = (doctorId, available) => {
  if (io) {
    io.emit("doctor-availability-changed", { doctorId, available });
  }
};
