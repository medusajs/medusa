if (typeof process.env.DB_TEMP_NAME === "undefined") {
  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  process.env.DB_TEMP_NAME = `medusa-region-integration-${tempName}`
}

process.env.MEDUSA_REGION_DB_SCHEMA = "public"
// TODO: Remove this when all modules are migrated to v2
process.env.MEDUSA_FF_MEDUSA_V2 = true
