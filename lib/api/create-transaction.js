const blockchain = require('../blockchain');

module.exports = data => {
    const privateKey = data.private_key
    const blockData = {
        type: 'transaction', 
        buyer_data: data.buyer_data,
        asset_hash: data.asset_hash
    }

    blockchain.mine(blockData, null, privateKey)
}


