import getEnvVariables, { ADMIN_CORS, AUTH_CORS, DEFAULT_REDIS_URL, STORE_CORS } from "../get-env-variables.js"

const envRegex = {
  medusaOnboarding: /MEDUSA_ADMIN_ONBOARDING_TYPE=(?<value>.+)/,
  storeCors: /STORE_CORS=(?<value>.+)/,
  adminCors: /ADMIN_CORS=(?<value>.+)/,
  authCors: /AUTH_CORS=(?<value>.+)/,
  redisUrl: /REDIS_URL=(?<value>.+)/,
  jwtSecret: /JWT_SECRET=(?<value>.+)/,
  cookieSecret: /COOKIE_SECRET=(?<value>.+)/,
  db: /DATABASE_URL=(?<value>.+)/,
  postgresUrl: /POSTGRES_URL=(?<value>.+)/,
  onboardingNextjs: /MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=(?<value>.+)/,
}

describe("get-env-variables", () => {
  it("should retrieve default environment variables", () => {
    const envVariables = getEnvVariables({
      // The URL itself doesn't matter here
      dbConnectionString: "example-url"
    })

    const onboardingTypeMatch = envVariables.match(envRegex.medusaOnboarding)
    expect(onboardingTypeMatch?.groups?.value).toEqual("default")

    const storeCorsMatch = envVariables.match(envRegex.storeCors)
    expect(storeCorsMatch?.groups?.value).toEqual(STORE_CORS)

    const adminCorsMatch = envVariables.match(envRegex.adminCors)
    expect(adminCorsMatch?.groups?.value).toEqual(ADMIN_CORS)

    const authCorsMatch = envVariables.match(envRegex.authCors)
    expect(authCorsMatch?.groups?.value).toEqual(AUTH_CORS)

    const redisUrlMatch = envVariables.match(envRegex.redisUrl)
    expect(redisUrlMatch?.groups?.value).toEqual(DEFAULT_REDIS_URL)

    const jwtSecretMatch = envVariables.match(envRegex.jwtSecret)
    expect(jwtSecretMatch?.groups?.value).toEqual("supersecret")

    const cookieSecretMatch = envVariables.match(envRegex.cookieSecret)
    expect(cookieSecretMatch?.groups?.value).toEqual("supersecret")

    expect(envVariables).toMatch(envRegex.db)
    expect(envVariables).toMatch(envRegex.postgresUrl)
    expect(envVariables).not.toMatch(envRegex.onboardingNextjs)
  })

  it("shouldn't retrieve db variables", () => {
    const envVariables = getEnvVariables({
      dbConnectionString: "example-url",
      skipDb: true
    })

    expect(envVariables).not.toMatch(envRegex.db)
    expect(envVariables).not.toMatch(envRegex.postgresUrl)
  })

  it("should set next.js onboarding env variable", () => {
    const envVariables = getEnvVariables({
      dbConnectionString: "example-url",
      nextjsDirectory: "test"
    })

    expect(envVariables).toMatch(envRegex.onboardingNextjs)
  })
})