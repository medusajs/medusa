import dotenv from "dotenv"
import { join } from "path"

const devMode = ["dev", "develop", "development", "local"]
const testMode = ["test", "tests"]
const prodMode = ["prod", "production"]

process.env.NODE_ENV = process.env.NODE_ENV ?? "development"

let targetEnvFile: ".env" | ".env.local" | ".env.test"

switch (true) {
  case devMode.includes(process.env.NODE_ENV):
    targetEnvFile = ".env.local"
    break
  case testMode.includes(process.env.NODE_ENV):
    targetEnvFile = ".env.test"
    break
  case prodMode.includes(process.env.NODE_ENV):
    targetEnvFile = ".env"
    break
  default:
    throw new Error(
      `⚠️  Couldn't find target env file for the specified environment ${
        process.env.NODE_ENV
      }. ⚠️\nExpected environment:\n- development: ${devMode.join(
        " or "
      )}\n- test: ${testMode.join(" or ")}\n- production: ${prodMode.join(
        " or "
      )}`
    )
}

let envFile = dotenv.config({
  path: join(process.cwd(), targetEnvFile),
})

if (!envFile) {
  /* Always fallback to .env to avoid breaking existing configurations */
  console.log(`⚠️  Couldn't find target env file for the environment ${process.env.NODE_ENV}. For the test environment, fallback to .env.`)
  envFile = dotenv.config({
    path: join(process.cwd(), '.env'),
  })
}

if (!envFile) {
  throw new Error(
    `⚠️  Couldn't find target env file for the environment ${process.env.NODE_ENV}. The command must be run at the root level of your project.`
  )
}
