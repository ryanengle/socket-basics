var name = getQueryVariable('name') || 'Guest';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

// Update h1 tag
jQuery('.room-title').text(room);

// Event is fired when the client connects to the server
// event name, function to run when the event happens
socket.on('connect', function () {
   console.log('Connected to socket.io server!'); 
   
   // joinRoom event
   socket.emit('joinRoom', {
       name: name,
       room: room
   });
});

// custom event (message from server)
socket.on('message', function (message) {
   
   console.log('New message:\n' + message.text);
   
   // Extract timestamp
   var momentTimeStamp = moment.utc(message.timeStamp);
   
   // $ indicates jQuery
   // target by class, start with '.'
   // append adds to end of html    
   var $messages = jQuery('.messages');   
   
   // new element
   var $message = jQuery('<li class="list-group-item"></li>');   
   // Add to new element 
   $message.append('<p><strong>' + momentTimeStamp.local().format('YYYY-MM-DD HH:mm:ss (') +
            message.name + '):</strong></p>');
   $message.append('<p>' + message.text + '</p>');
   
   // append new element to website
   $messages.append($message);
});

// Handles submitting of new message
// $ means it stores a jQuery instance of element
// jQuery will take a selector 
//      name of html tag or id
//      using id, requires '#'
var $form = jQuery('#message-form');

// wait for submit event from form
$form.on('submit', function (event) {
    // used on a form when you don't want to refresh entire page on submit
    event.preventDefault();
    
    var $message = $form.find('input[name=message]'); 
    
    // send msg to server
    socket.emit('message', {
        name: name,        
        text: $message.val()
    });
    
    // clear input box and keep cursor in it
    $message.val('');
    
});