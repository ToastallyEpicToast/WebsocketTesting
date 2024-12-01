const io = require('socket.io')(3000)
const express = require('express')

const app = express()

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

app.get("/", (req, res) => {
   res.sendFile('index.html', {root: __dirname })
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Listening on port ${port}`))