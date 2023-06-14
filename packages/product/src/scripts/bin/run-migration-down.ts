import { revertMigration } from "../migration-down"

export default (async () => {
  const { config } = await import("dotenv")
  config()
  await revertMigration()
})()
