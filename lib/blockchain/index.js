const Block = require('./block')
const CryptoJS = require('crypto-js')
const logger = require('../cli/util/logger.js');
const spinner = require('../cli/util/spinner.js');
const logBlockchain = require('../cli/util/table.js');
const RIPEMD160 = require('ripemd160');
const bs58 = require('bs58');
const sha256 = require('sha256');

class Blockchain {
  constructor () {
    this.blockchain = [Block.genesis]
    this.difficulty = 4
    this.broadcast = null;
  }

  get () {
    return this.blockchain
  }

  get latestBlock () {
    return this.blockchain[this.blockchain.length - 1]
  }

  registerBroadcaster(cb) {
    if (typeof cb === 'function') {
      this.broadcast = cb;
    }
  }

  mine (seed, cb) {
    let newBlock

    if (seed.type === 'asset_block') {
      newBlock = this.generateNextAssetBlock(seed)
    } else if (seed.type === 'transaction') {
      newBlock = this.generateNextBlock(seed)
    } else {
      newBlock = this.generateNextBlock(seed) 
    }

    if(this.addBlock(newBlock)) {
      typeof cb === 'function' ? cb(newBlock) : null;
      if (this.broadcast) {
        this.broadcast(this.blockchain);
      }
      logger.log("🎉  Congratulations! A new block was mined. 💎")
    }
  }

  replaceChain (newBlocks) {
    if (!this.isValidChain(newBlocks)) {
      logger.log("❌ Replacement chain is not valid. Won't replace existing blockchain.")
      return null;
    }

    if (newBlocks.length <= this.blockchain.length) {
      logger.log("❌  Replacement chain is shorter than original. Won't replace existing blockchain.")
      return null;
    }

    logger.log('✅  Received blockchain is valid. Replacing current blockchain with received blockchain')
    this.blockchain = newBlocks.map(json => new Block(
      json.index, json.previousHash, json.timestamp, json.data, json.hash, json.nonce
    ))

    if (this.broadcast) {
      this.broadcast(this.blockchain);
    }
  }

  isValidChain (blockchainToValidate) {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(Block.genesis)) {
      return false
    }

    const tempBlocks = [blockchainToValidate[0]]
    for (let i = 1; i < blockchainToValidate.length; i = i + 1) {
      if (this.isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
        tempBlocks.push(blockchainToValidate[i])
      } else {
        return false
      }
    }
    return true
  }

  addBlock (newBlock) {
    if (this.isValidNewBlock(newBlock, this.latestBlock)) {
      this.blockchain.push(newBlock);
      return true;
    }
    return false;
  }

  addBlockFromPeer(json) {
    if (this.isValidNewBlock(json, this.latestBlock)) {
      this.blockchain.push(new Block(
        json.index, json.previousHash, json.timestamp, json.data, json.hash, json.nonce
      ))
    }
  }

  calculateHashForBlock (block) {
    return this.calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.nonce)
  }

  calculateHash (index, previousHash, timestamp, data, nonce) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data + nonce).toString()
  }

  isValidNewBlock (newBlock, previousBlock) {
    const blockHash = this.calculateHashForBlock(newBlock);

    if (previousBlock.index + 1 !== newBlock.index) {
      logger.log('❌  new block has invalid index')
      return false
    } else if (previousBlock.hash !== newBlock.previousHash) {
      logger.log('❌  new block has invalid previous hash')
      return false
    } else if (blockHash !== newBlock.hash) {
      logger.log(`❌  invalid hash: ${blockHash} ${newBlock.hash}`)
      return false
    } else if (!this.isValidHashDifficulty(this.calculateHashForBlock(newBlock))) {
      logger.log(`❌  invalid hash does not meet difficulty requirements: ${this.calculateHashForBlock(newBlock)}`);
      return false;
    }

    // if newblock is transaction
    // then check signature is legit

    return true
  }

  generateNextAssetBlock (blockData) {
    // remove the private key from the block data
    delete blockData.private_key

    const previousBlock = this.latestBlock;
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime()
    let nonce = 0;
    let nextHash = '';
    const randSpinner = spinner.getRandomSpinner();
    while(!this.isValidHashDifficulty(nextHash)) {
      nonce = nonce + 1;
      nextHash = this.calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData, nonce);
      spinner.draw(randSpinner);
    }
    spinner.clear();

    blockData.asset_hash = this.generateAssetHash(nextHash)

    const nextBlock = new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash, nonce);
    logBlockchain([nextBlock]);
    return nextBlock; 
  }

  generateAssetHash(hash) {
    const ripemd_stream = new RIPEMD160()
    let asset_hash = ripemd_stream.update(sha256(hash)).digest('hex')
    const bytes = Buffer.from(asset_hash, 'hex')
    asset_hash = bs58.encode(bytes)

    return asset_hash
  }

  generateNextBlock (blockData) {
    const previousBlock = this.latestBlock;
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime()
    let nonce = 0;
    let nextHash = '';
    const randSpinner = spinner.getRandomSpinner();
    while(!this.isValidHashDifficulty(nextHash)) {
      nonce = nonce + 1;
      nextHash = this.calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData, nonce);
      spinner.draw(randSpinner);
    }
    spinner.clear();
    const nextBlock = new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash, nonce);
    logBlockchain([nextBlock]);
    return nextBlock;
  }

  isValidHashDifficulty(hash) {
    for (var i = 0, b = hash.length; i < b; i ++) {
      if (hash[i] !== '0') {
        break;
      }
    }
    return i === this.difficulty;
  }
}

module.exports = new Blockchain()