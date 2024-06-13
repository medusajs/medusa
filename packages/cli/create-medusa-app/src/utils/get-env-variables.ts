import { EOL } from "os"
import { PrepareOptions } from "./prepare-project.js"

export const STORE_CORS = "http://localhost:8000,https://docs.medusajs.com,https://medusa-docs-v2-git-docs-v2-medusajs.vercel.app,https://medusa-resources-git-docs-v2-medusajs.vercel.app"
export const ADMIN_CORS = "http://localhost:7000,http://localhost:7001,https://docs.medusajs.com,https://medusa-docs-v2-git-docs-v2-medusajs.vercel.app,https://medusa-resources-git-docs-v2-medusajs.vercel.app"
export const AUTH_CORS = ADMIN_CORS
export const DEFAULT_REDIS_URL = "redis://localhost:6379"

type Options = Pick<PrepareOptions, "onboardingType" | "skipDb" | "dbConnectionString" | "nextjsDirectory">

export default function getEnvVariables({
  onboardingType = "default",
  skipDb,
  dbConnectionString,
  nextjsDirectory
}: Options): string {
  let env = `MEDUSA_ADMIN_ONBOARDING_TYPE=${onboardingType}${EOL}STORE_CORS=${STORE_CORS}${EOL}ADMIN_CORS=${ADMIN_CORS}${EOL}AUTH_CORS=${AUTH_CORS}${EOL}REDIS_URL=${DEFAULT_REDIS_URL}${EOL}JWT_SECRET=supersecret${EOL}COOKIE_SECRET=supersecret`

  if (!skipDb) {
    env += `${EOL}DATABASE_URL=${dbConnectionString}${EOL}POSTGRES_URL=${dbConnectionString}`
  }

  if (nextjsDirectory) {
    env += `${EOL}MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=${nextjsDirectory}`
  }

  return env
}