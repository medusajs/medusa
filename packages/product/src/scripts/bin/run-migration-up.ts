import { runMigrations } from "../migration-up"

export default (async () => {
  const { config } = await import("dotenv")
  config()
  await runMigrations()
})()
