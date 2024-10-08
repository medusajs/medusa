#!/usr/bin/env node

try {
  require("ts-node").register({})
  require("tsconfig-paths").register({})
} catch {}
require("dotenv").config()
require("./dist/index.js")
