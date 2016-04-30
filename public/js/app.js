var socket = io();

// event name, function to run when the event happens
socket.on('connect', function () {
   console.log('Connected to socket.io server!'); 
});