#!/usr/bin/env node

function getTsNodeCompiler() {
  const paths = [process.cwd()]
  if (
    parseInt(require(require.resolve("typescript", { paths })).version, 10) < 7
  ) {
    return
  }

  try {
    return require.resolve("@typescript/typescript6", { paths })
  } catch {
    const error = new Error(
      'TypeScript 7 has no compiler API for ts-node to use. Install "@typescript/typescript6" as a dev dependency to load TypeScript files.'
    )
    error.code = "TS6_COMPILER_MISSING"
    throw error
  }
}

try {
  require("ts-node").register({ compiler: getTsNodeCompiler() })
  require("tsconfig-paths").register({})
} catch (e) {
  const isProduction = process.env.NODE_ENV === "production"
  if (!isProduction) {
    if (e.code === "TS6_COMPILER_MISSING") {
      console.error(e.message)
      process.exit(1)
    }
    console.warn(
      "ts-node cannot be loaded and used, if you are running in production don't forget to set your NODE_ENV to production"
    )
    console.warn(e)
  }
}
require("dotenv").config({ quiet: true })
require("./dist/index.js")
