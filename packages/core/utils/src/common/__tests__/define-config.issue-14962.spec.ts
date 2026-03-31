/**
 * Issue #14962: REDIS_URL missing from medusa_config.ts
 *
 * Bug Report Summary:
 * The CLI adds REDIS_URL to the .env file when creating a new project,
 * but the defineConfig() function does not automatically include redisUrl
 * from process.env.REDIS_URL in non-cloud mode.
 *
 * This creates an inconsistency:
 * - .env contains: REDIS_URL=redis://localhost:6379
 * - medusa-config.ts does NOT contain: redisUrl: process.env.REDIS_URL
 *
 * Expected behavior: Either defineConfig() should automatically read REDIS_URL
 * OR the CLI should not add REDIS_URL to .env
 */

import { defineConfig } from "../define-config"

describe("Issue #14962: REDIS_URL missing from medusa_config.ts", () => {
  let originalExecContext: string | undefined
  let originalRedisUrl: string | undefined

  beforeEach(() => {
    originalExecContext = process.env.EXECUTION_CONTEXT
    originalRedisUrl = process.env.REDIS_URL
    delete process.env.EXECUTION_CONTEXT
  })

  afterEach(() => {
    if (originalExecContext === undefined) {
      delete process.env.EXECUTION_CONTEXT
    } else {
      process.env.EXECUTION_CONTEXT = originalExecContext
    }

    if (originalRedisUrl === undefined) {
      delete process.env.REDIS_URL
    } else {
      process.env.REDIS_URL = originalRedisUrl
    }
  })

  it("should demonstrate BUG: defineConfig does not automatically add redisUrl from REDIS_URL in non-cloud mode", () => {
    // Setup: This simulates what the CLI does in prepare-project.ts line 188
    // The CLI adds REDIS_URL to the .env file
    process.env.REDIS_URL = "redis://localhost:6379"

    // Reproduce: Call defineConfig() WITHOUT explicitly passing redisUrl
    // This simulates the default medusa-config.ts template that users get
    const config = defineConfig({
      projectConfig: {
        databaseUrl: "postgres://localhost/medusa",
        http: {
          storeCors: "http://localhost:8000",
          adminCors: "http://localhost:7000",
          authCors: "http://localhost:7000",
          jwtSecret: "supersecret",
          cookieSecret: "supersecret",
        },
      },
    })

    // BUG: Even though REDIS_URL is set in the environment,
    // defineConfig() does NOT automatically add redisUrl to the config
    // This creates an inconsistency with the .env file
    expect(config.projectConfig.redisUrl).toBeUndefined()

    // After the bug is fixed, this assertion should pass instead:
    // expect(config.projectConfig.redisUrl).toBe("redis://localhost:6379")
  })
})
