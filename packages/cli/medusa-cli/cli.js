#!/usr/bin/env node

function getTsNodeCompiler() {
  if (parseInt(require("typescript").version, 10) < 7) {
    return
  }

  try {
    return require.resolve("@typescript/typescript6")
  } catch {
    throw new Error(
      'TypeScript 7 has no compiler API for ts-node to use. Install "@typescript/typescript6" as a dev dependency to load TypeScript files.'
    )
  }
}

try {
  require("ts-node").register({ compiler: getTsNodeCompiler() })
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
