import { io } from "socket.io-client";

let socket = null;

// Connect to socket.io server and join user's own channel
export const initiateSocketConnection = (userId) => {
  if (socket && socket.connected) return socket;

  socket = io("http://localhost:3002");
  console.log(`🔌 Connecting socket client for user ${userId}...`);

  socket.on("connect", () => {
    console.log("🔌 Connected to socket server");
    if (userId) {
      socket.emit("join-user", userId);
    }
  });

  return socket;
};

// Disconnect from socket.io server
export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Disconnecting socket client...");
    socket.disconnect();
    socket = null;
  }
};

// Join doctor room and register callback for live queue shifts
export const subscribeToDoctorQueue = (doctorId, callback) => {
  if (!socket) {
    console.warn("Socket not initialized. Call initiateSocketConnection first.");
    return;
  }

  socket.emit("join-doctor-queue", doctorId);
  
  socket.on("queue-updated", (data) => {
    console.log("📨 Queue shift received:", data);
    callback(data);
  });
};

// Leave doctor room and remove listeners
export const unsubscribeFromDoctorQueue = (doctorId) => {
  if (!socket) return;

  socket.emit("leave-doctor-queue", doctorId);
  socket.off("queue-updated");
};

// Global listener for doctor online/offline alerts
export const listenToDoctorAvailability = (callback) => {
  if (!socket) return;
  
  socket.on("doctor-availability-changed", (data) => {
    console.log("📨 Doctor availability changed:", data);
    callback(data);
  });
};

export const stopListeningToDoctorAvailability = () => {
  if (socket) {
    socket.off("doctor-availability-changed");
  }
};

export { socket };
