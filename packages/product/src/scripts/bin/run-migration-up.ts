import { runMigrations } from "../migration-up"
import { config } from "dotenv"

config()

export default (async () => {
  await runMigrations()
})()
