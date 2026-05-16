const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/Message');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// Socket.io Logic
const onlineUsers = new Map(); // Map of userId -> socketId

io.on('connection', (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  // User comes online
  socket.on('register_user', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, text } = data;

    try {
      // Save message to MongoDB
      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
      });

      // Send to the receiver if they are online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', newMessage);
      }
      
      // Also send it back to the sender so their UI updates with the actual DB record
      socket.emit('receiveMessage', newMessage);
      
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log(`Socket Disconnected: ${socket.id}`);
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('online_users', Array.from(onlineUsers.keys()));
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
