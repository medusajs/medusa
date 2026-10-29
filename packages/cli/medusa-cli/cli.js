#!/usr/bin/env node

try {
  require("ts-node").register({})
  require("tsconfig-paths").register({})
} catch (e) {
  const isProduction = process.env.NODE_ENV === "production"
  if (!isProduction) {
    console.warn(
      "ts-node cannot be loaded and used, if you are running in production don't forget to set your NODE_ENV to production"
    )
    console.warn(e)
  }
}
require("dotenv").config({ quiet: true })
require("./dist/index.js")
