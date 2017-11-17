"use strict";
const blockchain = require('../../../blockchain');
const p2p = require('../../../p2p');
const router = require('express').Router();

// acts like a peer node/connection- ( name/host + port {management} )

// by default an already started peer node
// auto

// Mine a new block. Eg: POST api/blockhain/mine -data 'hello!
router.get("/blockchain/mine/:data", (req, res, next) => {
  blockchain.mine(req.params.data);
  p2p.broadcastLatest();
  res.status(200).json(blockchain.get());
});

router.post("/blockchain/mine", (req, res, next) => {
  /*
    req.body
    {
      private_key,
      buyer_data,
      asset_hash,
    }
   */
  blockchain.mine(req.body);
  p2p.broadcastLatest();
  res.status(200).json(blockchain.get());
});

// See the current state of the blockchain. Eg. GET api/blockhain/list
router.get("/blockchain/list", (req, res, next) => {
  res.status(200).json(blockchain.get());
});

// Search a blockchain by it's hash. Eg. GET api/blockhain/search/000001#####...##
router.get("/blockchain/search/:hash", (req, res, next) => {
  res.status(200).json(blockchain.get().filter(block => {
    return block.hash === req.params.hash;
  }));
});

// 'connect <host> <port>', "Connect to a new peer. Eg: POST api/peers/connect -data {host: 'localhost', port: 2727}"
router.get("/peers/connect/:port/:host", (req, res, next) => {
  p2p.connectToPeer(req.params.host || 'localhost', req.params.port);
  res.status(200).json('ok');
});

// 'open <port>', 'Open port to accept incoming connections. Eg: POST api/peers/open -data {port:2727}'
router.get("/peers/open/:port", (req, res, next) => {
  if (req.params.port) {
    p2p.startServer(req.params.port);
    res.status(200).json(`valid port`);
  } else {
    res.status(500).json(`invalid port!`)
  }
});

// Discover new peers from your connected peers. eg. GET api/peers/discover
router.get("/peers/discover", (req, res, next) => {
  res.status(200).json('');
});

// Get the list of connected peers. Eg: GET api/peers/list
router.get("/peers/list", (req, res, next) => {
  res.status(200).json(p2p.peers.map(peer => {
    return `👤  ${peer.pxpPeer.socket._host} \n`;
  }));
});

module.exports = router;