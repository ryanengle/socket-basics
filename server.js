var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();
// start a new server and use the express app as boilerplate.
//      thus anything the express app listens to, the server
//      should also listen to.
var http = require('http').Server(app);
// install module, but call with http server
var io = require('socket.io')(http);

// expose a folder to public
app.use(express.static(__dirname + '/public'));

// listen for events (name of event, callback) 
io.on('connection', function () {
    console.log('user connected via socket.io!');
});


// start server, provide PORT and callback
http.listen(PORT, function() {
    console.log('Server started');
})


 