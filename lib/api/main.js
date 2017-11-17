"use strict";
const http = require("http");
const port = normalizePort(process.env.PORT || 8000);
const blockchain = require('../blockchain');
const signature = require('../signature');
let server;

function normalizePort(val) {
  let port = typeof val === "string" ? parseInt(val, 10) : val;
  if (!isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error) {
  if (error.syscall !== "listen") throw error;
  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.info(`Listening on ${bind}`);
}

function start() {
  console.info("booting %s", "blockchain api");
  let Api = require("./index.js");
  Api.set("port", port);
  server = http.createServer(Api);
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);

  var io = require('socket.io')(server);
  io.on('connection', client => {
    client.on('join', data => {
        console.log(data);
    });
    client.on('request_certificate', data => {
      //
      // data = {private_key, label}
      //

      let is_generated_private_key = false
      const block_data = {
        type: 'asset_block',
        label: data.label
      };

      let private_key

      if (
        data.private_key === null
        || data.private_key === ''
      ) {
        private_key = signature.generatePrivateKey()
        is_generated_private_key = true
      } else {
        private_key = data.private_key
      }

      block_data.key = signature.getPublicKey(private_key)
      block_data.private_key = private_key

      blockchain.mine(block_data, certificate=>{
        const socket_data = {
          privateKey: private_key,
          certificate: certificate,
        };

        client.emit('send_certificate', socket_data);
      });
    });
    client.emit('broadcast', blockchain.blockchain);
  });

  blockchain.registerBroadcaster(function(data) {
    io.emit('broadcast', data);
    console.log(data);
  });
}

function restart() {
  server.close();
  start();
}

module.exports = {
  start, restart
};