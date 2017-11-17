<blockchain>
  <ul>
    <li each={blocks}>
      <span class="index">{index + 1}</span>
      <svg class="icon"><use xlink:href="{icon(data.type)}"/></svg>
      <p>
        {type(data.type)}
        <span class="date">{date(timestamp)}</span>
        <span if={data.author}>Author: {data.author}</span>
        <span if={data.buyer_data}>Buyer: {data.buyer_data}</span>
        <span if={data.label}>Label: {data.label}</span>
      </p>
      <p if={data.asset_hash}><i>Asset</i>: {data.asset_hash}</p>
      <p if={data.key}><i>Author</i>: {data.key}</p>
      <div class="footer">
        <span>{hash}</span>
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
      margin-bottom: .25em;
    }

    li p {
      margin-bottom: .5em;
    }

    .icon {
      position: absolute;
      right: .5em;
      top: .5em;
      width: 24px;
      height: 24px;
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
      padding-top: 1em;
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

    this.icon = type => {
      switch(type) {
        case 'genesis':
          return '#layers';
        case 'asset_block':
          return '#attachment';
        default:
          return '#key';
      }
    }

    this.type = type => {
      switch(type) {
        case 'transaction':
          return 'Transaction';
        case 'asset_block':
          return 'Asset';
        default:
          return 'Genesis';
      }
    }

    let limitBlocksDisplayed = data => {
      self.blocks = data.length > 5 ? data.slice(data.length-5, data.length) : data;
      self.update();
    }

    riot.store.on('search-blockchain', (value, type) => {
      let results = [];
        if (type === 1) {
          results = _data.filter(node => {
            return node.data.asset_hash ? node.data.asset_hash.includes(value) : false;
          });
        } else {
          results = _data.filter(node => {
            return node.hash.includes(value);
          });
        }
        limitBlocksDisplayed(results);
    });

    this.opts.socket.on('broadcast', data => {
        console.log(data);
        _data = data;
        limitBlocksDisplayed(data);
    });
  </script>
</blockchain>