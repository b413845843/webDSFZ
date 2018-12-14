const socket = require('socket.io')
const jwt = require('jsonwebtoken')
var config = require('./config/jwt_config')
var io;

var chatSys = {
  users: [],
  rooms: ['hello'],
  addNewUser(socket) {
    this.users.push(socket)
  },
  start(server) {
     // socket.io
    io = socket(server)
    // middleware token验证
    io.use((socket, next) => {
      let token = socket.handshake.query.token;
      try {
        var decoded = jwt.verify(token, config.jwtsecret);
        socket.user = decoded
        socket.join(this.rooms[0])
        this.addNewUser(socket)
        return next();
      } catch (err) {
        return next(new Error('authentication error'));
      }
    });

    io.sockets.on('connection', socket => {
      console.log(`新客户端连接: ${socket.user.name}`);
      socket.emit('userEnter', { usersCount: this.users.length })

      socket.on('newMessage', data => {
        console.log(`收到信息 ${socket.user.name} ${data.message}`);
        // socket.emit('newMessage', { user: socket.user.name, message: data.message })
        // socket.broadcast.in(this.rooms[0]).emit('newMessage', { user: socket.user.name, message: data.message })
        io.sockets.in(this.rooms[0]).emit('newMessage', { user: socket.user.name, message: data.message });
      })

      socket.on('disconnect', () => {
        this.users = this.users.filter(item => {
          if (item === socket) {
            console.log(`${socket.user.name}:连接断开`);
            return false
          }
        })
      })
    })
  }
}

module.exports = chatSys