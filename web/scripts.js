var socket = io.connect('http://localhost:8000');
socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});


riot.tag('blockchain',
'<ul><li each={blocks}>{index} - {hash} - {data}</li></ul>',
'blockchain { display: block; border: 2px }',
'class="table"',
function (opts) {
  var self = this
  this.blocks = []

  socket.on('broadcast', function(data) {
    console.log(data);
    self.blocks = data;
    self.update();
  });
});

riot.mount('blockchain');