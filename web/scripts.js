var socket = io.connect(window.location.host);
socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});

riot.mount('blockchain', {socket});
riot.mount('popup', {socket});