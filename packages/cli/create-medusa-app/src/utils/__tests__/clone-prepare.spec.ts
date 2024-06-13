import { rm, readFile, stat } from "fs/promises"
import path from "path"
import ora, { Ora } from "ora"
import pg from "pg"
import runCloneRepo from "../clone-repo.js"
import prepareProject, { ADMIN_CORS, AUTH_CORS, DEFAULT_REDIS_URL, STORE_CORS } from "../prepare-project.js"
import runCreateDb from "../create-db.js"
import { nanoid } from "nanoid"
import formatConnectionString from "../format-connection-string.js"
import ProcessManager from "../process-manager.js"
import { tmpdir } from "os"

const abortController = new AbortController()
const spinner: Ora = ora()
const processManager = new ProcessManager()
const projectName = "test-store"
const projectPath = path.join(tmpdir(), projectName)
const envPath = path.join(projectPath, ".env")
const dbName = `medusa-${nanoid(4)}`

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

const defaultPrepareOptions = {
  directory: projectPath,
  spinner,
  processManager,
  boilerplate: true
}

describe("clone-prepare-start", () => {
  let dbConnectionString: string
  let client: pg.Client

  afterAll(async () => {
    // delete project
    await rm(projectPath, {
      force: true,
      recursive: true
    })

    spinner.stop()
  })

  describe("clone-repo", () => {
    it("should clone the repo", async () => {
      expect.assertions(1)
      await runCloneRepo({
        projectName: projectPath,
        abortController,
        spinner
      })
  
      return expect((async () => {
        await stat(projectPath)
      })()).resolves.toBeUndefined()
    })
  })

  describe("prepare-project", () => {
    beforeEach(async () => {
      const oldClient = new pg.Client({
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || ""
      })
      await oldClient.connect()
  
      client = await runCreateDb({
        client: oldClient,
        dbName,
        spinner
      })
  
      dbConnectionString = formatConnectionString({
        user: client.user,
        password: client.password,
        host: client.host,
        db: dbName
      })
  
      // delete .env file from project
      await rm(envPath, {
        force: true,
        recursive: true
      })
    })
  
    afterEach(async () => {
      await client.end()

      client = new pg.Client({
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || ""
      })

      await client.connect()
  
      await client.query(`DROP DATABASE IF EXISTS "${dbName}";`)
  
      await client.end()

      spinner.stop()
    })

    it("should prepare project successfully", async () => {
      expect.assertions(14)
      const inviteToken = await prepareProject({
        dbConnectionString,
        client,
        migrations: true,
        ...defaultPrepareOptions
      })
      spinner.stop()
  
      const envFile = await readFile(
        envPath,
        "utf-8"
      )
  
      // check if env file has necessary variables
      const onboardingTypeMatch = envFile.match(envRegex.medusaOnboarding)
      expect(onboardingTypeMatch?.groups?.value).toEqual("default")
  
      const storeCorsMatch = envFile.match(envRegex.storeCors)
      expect(storeCorsMatch?.groups?.value).toEqual(STORE_CORS)
  
      const adminCorsMatch = envFile.match(envRegex.adminCors)
      expect(adminCorsMatch?.groups?.value).toEqual(ADMIN_CORS)
  
      const authCorsMatch = envFile.match(envRegex.authCors)
      expect(authCorsMatch?.groups?.value).toEqual(AUTH_CORS)
  
      const redisUrlMatch = envFile.match(envRegex.redisUrl)
      expect(redisUrlMatch?.groups?.value).toEqual(DEFAULT_REDIS_URL)
  
      const jwtSecretMatch = envFile.match(envRegex.jwtSecret)
      expect(jwtSecretMatch?.groups?.value).toEqual("supersecret")
  
      const cookieSecretMatch = envFile.match(envRegex.cookieSecret)
      expect(cookieSecretMatch?.groups?.value).toEqual("supersecret")
  
      expect(envFile).toMatch(envRegex.db)
      expect(envFile).toMatch(envRegex.postgresUrl)
      expect(envFile).not.toMatch(envRegex.onboardingNextjs)

      // check that the invite was created
      expect(inviteToken).toBeDefined()
  
      // test that the migration ran
      const migrations = await client.query(
        `SELECT * FROM "mikro_orm_migrations";`
      )
      expect(migrations.rowCount).toBeGreaterThan(0)

      // test that seed and migrations ran
      const seedResult = await client.query(
        `SELECT * FROM "product";`
      )
      expect(seedResult.rowCount).toBeGreaterThan(0)

      // test that the following files exist
      return expect((async () => {
        await stat(path.join(projectPath, "node_modules"))
        await stat(path.join(projectPath, "build"))
        await stat(path.join(projectPath, "dist"))
      })()).resolves.toBeUndefined()
    })

    it("shouldn't run migrations", async () => {
      expect.assertions(1)

      await prepareProject({
        dbConnectionString,
        client,
        migrations: false,
        ...defaultPrepareOptions
      })
      spinner.stop()
  
      // test that the migrations didn't run
      return expect((async () => {
        await client.query(
          `SELECT * FROM "mikro_orm_migrations";`
        )
      })()).rejects.toThrow()
    })
    
    it("shouldn't perform anything database related", async () => {
      expect.assertions(3)

      await prepareProject({
        dbConnectionString,
        client,
        migrations: true,
        skipDb: true,
        ...defaultPrepareOptions
      })
      spinner.stop()

      const envFile = await readFile(
        envPath,
        "utf-8"
      )

      // db urls shouldn't be in env
      expect(envFile).not.toMatch(envRegex.db)
      expect(envFile).not.toMatch(envRegex.postgresUrl)
  
      // test that the migrations didn't run
      return expect((async () => {
        await client.query(
          `SELECT * FROM "mikro_orm_migrations";`
        )
      })()).rejects.toThrow()
    })
    
    it("should add Next.js directory env", async () => {      
      await prepareProject({
        dbConnectionString,
        client,
        skipDb: true,
        nextjsDirectory: "test",
        ...defaultPrepareOptions
      })
      spinner.stop()

      const envFile = await readFile(
        envPath,
        "utf-8"
      )

      const nextjsMatch = envFile.match(envRegex.onboardingNextjs)
      expect(nextjsMatch?.groups?.value).toEqual("test")
    })
  })
})