const path = require("path")

require("dotenv").config({ path: path.join(__dirname, ".env.test") })

if (typeof process.env.DB_TEMP_NAME === "undefined") {
  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  const chunkNumber = parseInt(process.env.CHUNK || "1")
  process.env.DB_TEMP_NAME = `medusa-integration-${tempName}-${chunkNumber}`
}

global.performance = require("perf_hooks").performance
