const { Server } = require('socket.io');

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('✅ New socket connected:', socket.id);

    socket.on('send_message', (msg) => {
      console.log('📨 Message received:', msg);
      socket.broadcast.emit('receive_message', msg);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
}

module.exports = setupSocket;
