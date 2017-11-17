<searchheader>
    <form onsubmit={search}>
        <input class="inputBig" ref="input" onkeyup={search}>
        <select onchange={changeType}>
            <option value="1">Assets</option>
            <option value="2">Transactions</option>
        </select>
        <button click={refs.input.focus()}><svg><use xlink:href="#interface"/></svg></button>
    </form>
    <style scoped>
     form {
        margin: 2em auto;
        width: 50%;
        display: inline-block;
        position: relative;
     }
     button {
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        width: 40px;
        height: 100%;
     }
     select {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border: none;
        border-radius: 0;
        background: transparent;
        outline: none;
     }
     input.inputBig {
        padding-left: 100px;
     }
    </style>
    <script>
        this.type = 1; // asset
        const self = this;
        this.changeType = e => {
            e.preventDefault();
            self.refs.input.focus();
            self.type = e.target.value;
        }
        this.search = e => {
            e.preventDefault();
            const value = self.refs.input.value.trim();
            riot.store.trigger('search-blockchain', value, self.type);
        }
    </script>
</searchheader>