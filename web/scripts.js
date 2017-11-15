var socket = io.connect('http://localhost:8000');
socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});

socket.on('broadcast', function(data) {
    console.log(data);
});