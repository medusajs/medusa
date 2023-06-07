import { revertMigration } from "../migration-down"
import { config } from "dotenv"

config()

export default (async () => {
  await revertMigration()
})()
