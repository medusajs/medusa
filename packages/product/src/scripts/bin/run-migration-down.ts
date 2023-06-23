#!/usr/bin/env node

export default (async () => {
  const { revertMigration } = await import("../migration-down")
  const { config } = await import("dotenv")
  config()
  await revertMigration()
})()
