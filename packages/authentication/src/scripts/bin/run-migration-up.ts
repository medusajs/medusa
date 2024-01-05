#!/usr/bin/env node

export default (async () => {
  const { runMigrations } = await import("../migration-up")
  const { config } = await import("dotenv")
  config()
  await runMigrations()
})()
