const path = require("path")

require("dotenv").config({ path: path.join(__dirname, ".env.test") })

if (typeof process.env.DB_TEMP_NAME === "undefined") {
  const tempName = [
    Date.now(),
    Math.floor(Math.random() * 9e2),
    parseInt(process.env.JEST_WORKER_ID || "1"),
  ].join("-")
  process.env.DB_TEMP_NAME = `medusa-integration-${tempName}`
}
