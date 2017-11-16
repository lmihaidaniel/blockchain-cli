<popup>
    <style scoped>
        .md-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 50%;
            max-width: 630px;
            min-width: 320px;
            height: auto;
            color: #D8DEE9;
            z-index: 2000;
            visibility: hidden;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            -webkit-transform: translateX(-50%) translateY(-50%);
            transform: translateX(-50%) translateY(-50%);
        }
        .md-show {
            visibility: visible;
        }
        .md-overlay {
            position: fixed;
            width: 100%;
            height: 100%;
            visibility: hidden;
            top: 0;
            left: 0;
            z-index: 1000;
            opacity: 0;
            background: rgba(76, 86, 106, 0.96);
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
        }
        .md-effect-1 .md-content {
            -webkit-transform: scale(0.7);
            -moz-transform: scale(0.7);
            -ms-transform: scale(0.7);
            transform: scale(0.7);
            opacity: 0;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            transition: all 0.3s;
        }
        .md-show.md-effect-1 .md-content {
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -ms-transform: scale(1);
            transform: scale(1);
            opacity: 1;
        }
        .md-show ~ .md-overlay {
            opacity: 1;
            visibility: visible;
        }

        .md-button {
            cursor: pointer;
            position: absolute;
            right: 2em;
            bottom: 2em;
            width: 3em;
            height: 3em;
            overflow: hidden;
        }

        .md-button span{
            font-size: 12px;
            white-space: nowrap;
            position: absolute;
            bottom: 0%;
            right: 105%;
            transform: translate(-5%, -50%);
            transition: all 0.3s;
            opacity: 0;
        }

        .md-button:hover{
            overflow: visible;
        }

        .md-button:hover span{
            display: inline-block;
            opacity: 1;
            transform: translate(-5%, -50%);
        }

        h3 {
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 0px;
            transition: all 0.3s;
        }
        .md-show h3 {
            letter-spacing: 1px;
            padding-bottom: 2em;
        }

        .inputBig {
            padding-right: 0;
            color: white;
            margin-bottom: .5em;
        }

        .inputBig::placeholder{
            color: #EBCB8B;
        }

        .legend {
            font-size: 13px;
            margin-bottom: 1em;
        }

        button {
            outline: none;
            background: #ebca8b;
            border: none;
            color: #2E3440;
            font-size: 20px;
            float: right;
            cursor: pointer;
            padding: 10px 20px;
            transition: all .3s linear;
        }

        button:hover{
            color: #2E3440;
        }

        .response {
            color: #2E3440;
            z-index: +1;
            top: 0;
            position: absolute;
            left: 0;
            width: 100%;
            height: 100%;
            width: 100%;
            height: 100%;
            opacity: 0;
            display: none;
            padding: .5em;
        }
        .response.bloc {
            display: block;
        }
        .response.show {
            opacity: 1;
            display: block;
            background: #ebca8b;
        }

        .close {
            position: absolute;
            top: .5em;
            right: .5em;
            width: 40px;
            height: 40px;
            cursor: pointer;
        }

        h4 {
            font-size: 16px;
            text-transform: uppercase;
            line-height: 40px;
            margin-bottom: 1em;
        }
    </style>

    <div class="md-modal md-effect-1 {md-show: popupVisible}">
        <div class="md-content">
            <h3>Create new license</h3>
            <div>
                <input class="inputBig" ref="inputPK" placeholder="Private key">
                <p class="legend">Lorem ipsum dolor sit amet. Not mandatory</p>
            </div>
            <br>
            <div>
                <input class="inputBig" ref="inputAsset" placeholder="Label asset">
                <p class="legend">Lorem ipsum dolor sit amet</p>
            </div>
            <br>
            <button class="md-close" onclick={requestCertificate}>
                <span show={!pending}>Generate</span>
                <div show={pending} class="loading"></div>
            </button>
        </div>
        <div class="response {bloc: pending} {show: certificate}">
            <div class="close" onclick={closeDialog}>
                <svg><use xlink:href="#close"/></svg>
            </div>
            <h4>Certificate generated</h4>
            <div>
                <h4>Your private key:</h4>
                <span>{certificate ? certificate.privateKey: null}</span>
                <h4>Certificate</h4>
                <p>HASH:</p>
                <span>{certificate ? certificate.certificate.hash: null}</span>
            </div>
        </div>
    </div>
    <div class="md-overlay" onclick={closeDialog}></div>
    <div class="md-button" show={!popupVisible} onclick={showDialog}>
        <svg><use xlink:href="#draw"/></svg>
        <span>Create new license</span>
    </div>

    <script>
        let self = this
        self.popupVisible = false
        self.pending = false;
        self.certificate = null;

        riot.store.on('show_popup', () => {
            self.showDialog();
            self.update()
        });

        riot.store.on('hide_popup', () => {
            self.closeDialog();
            self.update()
        });

        this.showDialog = () => {
            if (!self.pending) {
                self.popupVisible = true;
            }
        }

        this.closeDialog = () => {
            if (!self.pending) {
                self.popupVisible = false
                self.certificate = null;
                self.refs.inputAsset.value = '';
            }
        }

        socket.on('send_certificate', response => {
            self.pending = false;
            self.certificate = response;
            self.update();
        });

        this.requestCertificate = (e) => {
            e.preventDefault();
            let private_key = self.refs.inputPK.value.trim();
            let label = self.refs.inputAsset.value.trim();
            if (!label.length) {
                self.refs.inputAsset.focus();
                return;
            }
            if (!self.pending) {
                self.pending = true;
                socket.emit('request_certificate', {private_key, label});
            }
        }
    </script>
</popup>