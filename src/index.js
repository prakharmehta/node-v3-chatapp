const path = require('path')
const http =require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter= require('bad-words')
const {addUser,removeUser, getUser, getUsersInRoom}= require('./utils/users')
const {generatemessage,generatelocationmessage} = require('./utils/messages.js')

const app = express()
const server = http.createServer(app)//explicit creation to pass in socketio
const io = socketio(server)//raw http server is passed

const port = process.env.PORT || 3000
const publicDiretoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDiretoryPath))

//let count = 0

io.on('connection',(socket)=>
{
console.log('new web socket connection')

//send an event

socket.on('join',(options ,callback)=>
{
    const { error , user} = addUser({id: socket.id, ...options })
    if(error) {
        return callback(error)
    }
 

    socket.join(user.room)

    socket.emit('message',generatemessage('Admin','Welcome'))//emits to single event

    socket.broadcast.to(user.room).emit('message',generatemessage(user.username,user.username+' has joined!'))//everyone except itself
    io.to(user.room).emit('roomdata',{
        room: user.room,
        users: getUsersInRoom(user.room)
    })
    callback()
    //socket.emit(specific client)
    //io.emit(every connected)
    //socket.braodcast.emit(everyone except itself)
    //io.to.emit(to everybody in specific room)
    //socket.broadcast.to.emit(sending to everyone except to specific client limits to chatroom)

})

socket.on('sendmessage',(message,callback)=>
{
    const user = getUser(socket.id)
    const filter=new Filter()
    if(filter.isProfane(message))
    {
        return callback('profanity is not allowed')
    }
    
    io.to(user.room).emit('message',generatemessage(user.username,message))
    callback('Delivered')
})
socket.on('sendlocation',(coords,callback)=>
{
    const user = getUser(socket.id)
    io.to(user.room).emit('locationmessage',generatelocationmessage(user.username, 'https://google.com/maps?q='+coords.latitude+','+coords.longitude))
    callback()
})
socket.on('disconnect',()=> {
    const user = removeUser(socket.id)
    if(user)
    {
        io.to(user.room).emit('message',generatemessage(user.username,user.username+' has left'))//everyone
        io.to(user.room).emit('roomdata',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
}
})

})

server.listen(port,()=>
{
    console.log('Server is up on port')
})

