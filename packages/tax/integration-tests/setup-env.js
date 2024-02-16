if (typeof process.env.DB_TEMP_NAME === "undefined") {
  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  process.env.DB_TEMP_NAME = `medusa-tax-integration-${tempName}`
}

process.env.MEDUSA_TAX_DB_SCHEMA = "public"
