#!/usr/bin/env node

/**
 * In a bundled build (`medusa build --bundle`), `medusa start` and the
 * `medusa db:migrate` commands run the bundle straight away: loading TypeScript support
 * and the CLI first would undo much of the bundle's startup gain. The bundle's
 * launcher parses the same arguments; anything it doesn't support goes through
 * the full CLI.
 */
const BUNDLE_FLAGS = {
  start: ["-p", "--port", "-H", "--host", "--cluster", "--workers", "--servers"],
  "db:migrate": [
    "--skip-scripts",
    "--skip-links",
    "--skip-search",
    "--execute-all-links",
    "--execute-safe-links",
    "--execute-all-search",
    "--execute-safe-search",
    "--concurrency",
    "--all-or-nothing",
  ],
  "db:migrate:scripts": [],
  "db:migrate:search": ["--execute-all-search", "--execute-safe-search"],
}

const runsFromBundle = (() => {
  const [command, ...rest] = process.argv.slice(2)
  const flags = BUNDLE_FLAGS[command]
  if (!flags) {
    return false
  }
  if (rest.some((arg) => arg.startsWith("-") && !flags.includes(arg.split("=")[0]))) {
    return false
  }

  const fs = require("fs")
  const bundle = require("path").resolve("medusa-bundle.js")
  if (!fs.existsSync(bundle)) {
    return false
  }
  // Only a bundle written by `medusa build --bundle` (see its first line)
  const marker = "/* @medusajs/medusa bundle */"
  const head = Buffer.alloc(marker.length)
  const fd = fs.openSync(bundle, "r")
  fs.readSync(fd, head, 0, marker.length, 0)
  fs.closeSync(fd)
  return head.toString("utf8") === marker
})()

if (runsFromBundle) {
  require(require("path").resolve("medusa-bundle.js"))
} else {
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
  require("dotenv").config()
  require("./dist/index.js")
}
