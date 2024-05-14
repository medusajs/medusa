import { ConfigModule } from "@medusajs/types"
import { getConfigFile } from "medusa-core-utils"
import open from "open"

/**
 * A function to open the admin in the users default browser.
 * @param port - The port the server is running on
 * @param rootDirectory - The root directory of the project
 * @returns Attempts to open the admin in the users default browser.
 */
export async function openAdmin(port: number, rootDirectory: string) {
  // If we are not in development mode, we skip opening the admin
  if (process.env.NODE_ENV !== "development") {
    return
  }

  const { configModule, error } = getConfigFile<ConfigModule>(
    rootDirectory,
    `medusa-config`
  )

  if (error) {
    // If there is an error loading the config file, we skip attempting to open the admin
    return
  }

  const path = configModule?.admin?.path ?? "/app"

  return open(`http://localhost:${port}${path}`)
}
