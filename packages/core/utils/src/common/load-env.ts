import dotenv from "dotenv"
import { expand } from "dotenv-expand"
import { join } from "path"
const KNOWN_ENVIRONMENTS = ["staging", "production", "test"]

/**
 * Loads ".env" file based upon the environment in which the
 * app is running.
 *
 * - Loads ".env" file by default.
 * - Loads ".env.staging" when "environment=staging".
 * - Loads ".env.production" when "environment=production".
 * - Loads ".env.test" when "environment=test".
 *
 * The ".env" file is always loaded alongside the environment
 * specific .env file.
 *
 * This method does not return any value and updates the "process.env"
 * object instead.
 */
export function loadEnv(environment: string, envDir: string) {
  const filesToLoad = KNOWN_ENVIRONMENTS.includes(environment)
    ? [`.env.${environment}`, ".env"].map((file) => join(envDir, file))
    : [join(envDir, ".env")]
  try {
    expand(dotenv.config({ path: filesToLoad, quiet: true }))
  } catch {}
}
