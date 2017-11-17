const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')

class Signature {
    generatePrivateKey() {
        let private_key
        
        do {
            private_key = randomBytes(32)
        } while (!secp256k1.privateKeyVerify(private_key))
        
        return private_key.toString('base64')
    }

    getPublicKey(private_key) {
        private_key = Buffer.from(private_key, 'base64')
        const public_key = secp256k1.publicKeyCreate(private_key)
        
        return public_key.toString('base64')
    }
}

module.exports = new Signature()