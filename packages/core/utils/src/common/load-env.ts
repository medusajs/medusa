import dotenv from "dotenv"
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
 * This method does not return any value and updates the "process.env"
 * object instead.
 */
export function loadEnv(environment: string, envDir: string) {
  const fileToLoad = KNOWN_ENVIRONMENTS.includes(environment)
    ? `.env.${environment}`
    : ".env"
  try {
    dotenv.config({ path: join(envDir, fileToLoad) })
  } catch {}
}
