const socket = require('socket.io')
const jwt = require('jsonwebtoken')
var config = require('./config/jwt_config')
var io;

const USER_ENTER_LEAV = 'userEnterOrLeave'

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
            console.log(`验证${token}`);

            try {
                var decoded = jwt.verify(token, config.jwtsecret);
                socket.user = decoded
                socket.join(this.rooms[0])

                console.log(`=>通过`);
                return next();
            } catch (err) {
                console.log(`=>失败${JSON.stringify(err)}`);
                return next(new Error('authentication error'));
            }
        });

        io.sockets.on('connection', socket => {
            this.addNewUser(socket.user)
            console.log(`新客户端连接 共(${this.users.length}): ${socket.user.name}`);
            io.sockets.in(this.rooms[0]).emit(USER_ENTER_LEAV, { type: 0, user: socket.user.name, count: this.users.length });

            socket.on('newMessage', data => {
                console.log(`收到用户(${socket.user.name}) 信息 :${data.message}`);
                // socket.emit('newMessage', { user: socket.user.name, message: data.message })
                // socket.broadcast.in(this.rooms[0]).emit('newMessage', { user: socket.user.name, message: data.message })
                io.sockets.in(this.rooms[0]).emit('newMessage', { user: socket.user.name, message: data.message });
            })

            socket.on('disconnect', () => {
                console.log(`${socket.user.name}:连接断开前 共(${this.users.length})`);

                for (let index = 0; index < this.users.length; index++) {
                    const user = this.users[index];
                    if (user === socket.user) {
                        this.users.splice(index, 1)
                        break
                    }
                }

                io.sockets.in(this.rooms[0]).emit(USER_ENTER_LEAV, { type: 1, user: socket.user.name, count: this.users.length });
                console.log(`${socket.user.name}:连接断开 剩(${ this.users.length })`);
            })
        })
    }
}

module.exports = chatSys