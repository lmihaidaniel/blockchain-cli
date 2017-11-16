<searchheader>
    <form onsubmit={search}>
        <input class="inputBig" ref="input" onkeyup={search}>
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
    </style>
    <script>
        const self = this;
        this.search = e => {
            e.preventDefault();
            const value = self.refs.input.value.trim();
            riot.store.trigger('search-blockchain', value);
        }
    </script>
</searchheader>