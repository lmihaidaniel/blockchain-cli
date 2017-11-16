<blockchain>
  <ul>
    <li each={blocks}>
      <span class="index">{index + 1}</span>
      <span>{hash}</span>
      <span class="date">{date(timestamp)}</span>
      <div class="footer">
      </div>
    </li>
  </ul>
  <style scoped>
    ul {
      max-width: 640px;
      margin: 0 auto;
    }
    li {
      position: relative;
      display: block;
      vertical-align: top;
      padding: 1em;
      border-radius: 2px;
      background: white;
      text-align:left;
      box-shadow: 0 2px 1px rgba(170, 170, 170, 0.25);
      margin-bottom: 1em;
    }

    li span {
      display: block;
    }

    span.index{
      font-size: 12px;
      line-height: 16px;
      color: white;
      position: absolute;
      right: 100%;
      background: black;
      padding: 0 4px;
      margin-right: -4px;
    }

    span.date{
      font-size: 12px;
      line-height: 20px;
      color: #A1A1A4;
    }

    div.footer{
      margin-top: 1em;
      border-top: 1px solid #eee;
      font-size: 13px;
    }
  </style>
  <script>
    let self = this
    let _data = []
    this.blocks = []

    this.date = timestamp => {
        return new Date(timestamp).toISOString();
    }

    let limitBlocksDisplayed = data => {
      self.blocks = data.length > 5 ? data.slice(data.length-5, data.length) : data;
      self.update();
    }

    riot.store.on('search-blockchain', (value) => {
        let results = _data.filter(node => {
          return node.hash.includes(value);
        });
        limitBlocksDisplayed(results);
    });

    this.opts.socket.on('broadcast', data => {
        console.log(data);
        _data = data;
        limitBlocksDisplayed(data);
    });
  </script>
</blockchain>