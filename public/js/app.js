var socket = io();

// event name, function to run when the event happens
socket.on('connect', function () {
   console.log('Connected to socket.io server!'); 
});

// custom event (message from server)
socket.on('message', function (message) {
   console.log('New message:\n' + message.text); 
});