var socket = io();

// event name, function to run when the event happens
socket.on('connect', function () {
   console.log('Connected to socket.io server!'); 
});

// custom event (message from server)
socket.on('message', function (message) {
   console.log('New message:\n' + message.text); 
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
        // find()
        text: $message.val()
    });
    
    // clear input box and keep cursor in it
    $message.val('');
    
    
});