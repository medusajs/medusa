let logger
try {
  logger = require("@medusajs/cli/dist/reporter")
} catch {
  logger = require("@medusajs/medusa-cli/dist/reporter")
}

export { logger }
