const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')
const md5 = require('md5')

class Signature {
    generatePrivateKey() {
        let private_key
        
        do {
            private_key = randomBytes(32)
        } while (!secp256k1.privateKeyVerify(private_key))
        
        return private_key.toString('base64')
    }

    getPublicKey(private_key, return_buffer = false) {
        private_key = Buffer.from(private_key, 'base64')
        const public_key = secp256k1.publicKeyCreate(private_key)
        
        if (return_buffer) {
            return public_key
        }

        return public_key.toString('base64')
    }

    prepareMessage(message) {
        const message_str = JSON.stringify(message)
        const msg_data = Buffer.from(md5(message_str))

        return msg_data
    }

    sign(message, private_key, return_buffer = false) {
        private_key = Buffer.from(private_key, 'base64')
        const public_key = this.getPublicKey(private_key, true)
        const msg_data = this.prepareMessage(message)
        const signature = secp256k1.sign(msg_data, private_key).signature
        
        if (return_buffer) {
            return signature
        }

        return signature.toString('base64')
    }

    verify(message, signature, public_key) {
        const msg_data = this.prepareMessage(message)
        return (secp256k1.verify(msg_data, signature, public_key))
    }
}

module.exports = new Signature()