#!/usr/bin/env node

try {
  require("./dist/typescript-compatibility").assertTypeScriptCompatibility(
    require("typescript")
  )
  require("ts-node").register({})
  require("tsconfig-paths").register({})
} catch (e) {
  if (e?.code === "MEDUSA_UNSUPPORTED_TYPESCRIPT") {
    throw e
  }
  const isProduction = process.env.NODE_ENV === "production"
  if (!isProduction) {
    console.warn(
      "ts-node cannot be loaded and used, if you are running in production don't forget to set your NODE_ENV to production"
    )
    console.warn(e)
  }
}
require("dotenv").config()
require("./dist/index.js")
