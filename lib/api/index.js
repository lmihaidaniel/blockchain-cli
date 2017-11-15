"use strict";
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const blockChainRouter = require("./routes/blockchain");

class App {
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }
  middleware() {
    process.env.NODE_ENV != "production" && this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
  routes() {
    this.express.use(express.static(process.cwd() + '/web'))
    this.express.use("/api", blockChainRouter);
  }
}

module.exports = new App().express;