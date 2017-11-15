<blockchain class="table">
  <form onsubmit={search}>
    <input ref="input" onkeyup={search}>
    <button disabled={!blocks.length}>Search</button>
  </form>
  <ul>
    <li each={blocks}>
      {index} - {hash} - {data} - {date(timestamp)}
    </li>
  </ul>
  <script>
    var self = this
    var _data = []
    this.blocks = []

    this.date = function(timestamp) {
        return new Date(timestamp).toISOString();
    }

    this.search = function(e) {
        e.preventDefault();
        var value = self.refs.input.value.trim();
        var results = _data.filter(node => {
        return node.hash.includes(value);
        });
        self.blocks = results.length > 5 ? results.slice(results.length-5, results.length) : results;
    }

    this.opts.socket.on('broadcast', function(data) {
        console.log(data);
        _data = data;
        self.blocks = data.length > 5 ? data.slice(data.length-5, data.length) : data;
        self.update();
    });
  </script>
</blockchain>