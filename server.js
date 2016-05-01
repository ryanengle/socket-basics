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

// listen for events (name of event, callback) 
io.on('connection', function (socket) {
    console.log(moment().format("YYYY-MM-DD HH:mm:ss.SS") + ': User connected via socket.io!');
    
    // Receive a message from front end
    socket.on('message', function (message) {
       
       // Add JavaScript timestamp to message
       message.timeStamp = moment().valueOf();
       console.log(moment.utc(message.timeStamp).local().format(
           "YYYY-MM-DD HH:mm:ss.SS") + ': Message recv\'d: ' + message.text);
       
       // send to everyone including sender
       io.emit('message', message);
    });
    
    // Send a message to the front end app
    socket.emit('message', {        
        text: 'Welcome to the chat application',
        // Add JavaScript timestamp to message
        timeStamp: moment().valueOf()
    });
});

// start server, provide PORT and callback
http.listen(PORT, function() {
    console.log('Server started');
});


 