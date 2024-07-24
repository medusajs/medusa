#!/usr/bin/env node
try {
  require("ts-node").register({})
} catch {}
require("dotenv").config()
require("./dist/index.js")
