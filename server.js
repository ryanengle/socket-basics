var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();
// start a new server and use the express app as boilerplate.
//      thus anything the express app listens to, the server
//      should also listen to.
var http = require('http').Server(app);
// install module, but call with http server
var io = require('socket.io')(http);
// timestamps
var moment = require('moment');

// expose a folder to public
app.use(express.static(__dirname + '/public'));

// key/value pair containing user's name and room name
var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers (socket) {    
    // Determine room
    var info = clientInfo[socket.id];
    if (typeof info === 'undefined'){
        return; // stop, don't search for clients in rooms that don't exist
    }
    
    // Search for users in given room
    var users = [];
    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];
        
        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        } 
    });
    
    // emit message
    socket.emit('message', {
       name: 'System', 
       // join takes every element in an array, converts to string, 
       // and pushes it together
       text: 'Current users: ' + users.join(', '),
       timeStamp: moment().valueOf()
    });
}

// listen for events (name of event, callback) 
io.on('connection', function (socket) {
    console.log(moment().format("YYYY-MM-DD HH:mm:ss.SS: ") + 
        'User connected via socket.io!');
    
    // Receive event when a user leaves
    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id]; 
        // check to see if user was part of a chat room 
        if (typeof userData !== 'undefined') {
            // leave chat room
            socket.leave(userData.room);
            // announce to other users
            io.to(userData.room).emit('message', {
               name: 'System',
               text: userData.name + ' has left!',
               timeStamp: moment().valueOf() 
            });
            // delete info
            delete clientInfo[socket.id];
        }
    });    
    
    // Receive event to join a room
    // req object comes from app.js 
    socket.on('joinRoom', function (req) {
        // socket.id will be a dynamic value (use brackets)
        // req contains user name and room name
        clientInfo[socket.id] = req;
        
        // add socket to a specific room
        // built in method that tells socket.io library to
        // add socket to a specific room
        socket.join(req.room);
        // now when join is emitted from client, we get added to
        // room on server
        
        // Let everyone in room know who joined
        // broadcast sends event to everyone but current socket 
        // .to allows specification of room
        // emit sends the event containing the message
        socket.broadcast.to(req.room).emit('message', {
           name: 'System',
           text: req.name + ' has joined!', 
           timestamp: moment.valueOf()
        });    
    });
        
    // Receive a message from front end
    socket.on('message', function (message) {       
       // Add JavaScript timestamp to message
       message.timeStamp = moment().valueOf();
       console.log(moment.utc(message.timeStamp).local().format(
           "YYYY-MM-DD HH:mm:ss.SS") + ': Message recv\'d: ' + message.text);
       
       if (message.text === '@currentUsers'){
           sendCurrentUsers(socket);
       } else {
           // send to everyone including sender 
           // .to enables specification of room
           io.to(clientInfo[socket.id].room).emit('message', message);           
       }
    });
    
    // Send a message to the front end app
    socket.emit('message', {        
        text: 'Welcome to the chat application',
        // Add JavaScript timestamp to message
        timeStamp: moment().valueOf(),
        name: 'System'
    });
});

// start server, provide PORT and callback
http.listen(PORT, function() {
    console.log('Server started');
});
 