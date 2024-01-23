if (typeof process.env.DB_TEMP_NAME_inmemory === "undefined") {
  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  process.env.DB_TEMP_NAME_inmemory = `medusa-workflow-engine-inmemory-${tempName}`
}

process.env.MEDUSA_WORKFLOW_ENGINE_DB_SCHEMA = "public"
