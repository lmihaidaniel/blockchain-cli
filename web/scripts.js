var socket = io.connect(window.location.host);
socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});

function appStore() {
  riot.observable(this);

  this.on('hello', data => {
    console.log(data);
  });
}

riot.store = new appStore()
riot.mount('svgicons');
riot.mount('searchheader', {socket});
riot.mount('blockchain', {socket});
riot.mount('popup', {socket});