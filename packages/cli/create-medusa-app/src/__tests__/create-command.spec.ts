import execa from "execa"
import path from "path"
import { rm, readFile, stat } from "fs/promises"
import pg from "pg"
const { Client } = pg

const DB_REGEX = /DATABASE_URL=(?<url>.+?)/
const DEFAULT_PROJECT_NAME = "my-medusa-store"
const DEFAULT_DB_NAME = "cma-test"
// snippet of the success message
const SUCCESS_MESSAGE = "Change to the `my-medusa-store` directory to explore your Medusa"
const MIGRATIONS_MESSAGE = "Running Migrations..."
const basePath = path.resolve(__dirname, `../../`)

const projectPath = path.join(basePath, DEFAULT_PROJECT_NAME)
const nextjsPath = path.join(basePath, `${DEFAULT_PROJECT_NAME}-storefront`)

const runCLI = async (options: string[] = []) => {
  const params = ["dev", "--quiet", "--no-browser", ...options]
  try {
    const { all: logs } = await execa("yarn", params, {
      all: true,
      cwd: basePath
    })

    return logs
  } catch (err: any) {
    throw new Error(err.message + err.all)
  }
}

const getProjectDbUrl = async (): Promise<string | undefined> => {
  try {
    const envFile = await readFile(path.join(
      projectPath,
      ".env"
    ), "utf-8")
    const dbUrlMatch = envFile.match(DB_REGEX)
  
    return dbUrlMatch?.groups?.url
  } catch (e) {
    // file doesn't exist
  }
}

const dropDb = async () => {
  try {
    const dbUrl = await getProjectDbUrl()
    if (!dbUrl) {
      return
    }

    // delete the database
    const client = new Client({
      connectionString: dbUrl
    })

    await client.connect()
    await client.query(`DROP DATABASE ${client.database}`)
    await client.end()
  } catch (e) {
    // file doesn't exist
  }
}

const createDb = async (): Promise<string> => {
  const client = new Client()
  await client.connect()
  // drop database if it already exists
  await client.query(`DROP DATABASE IF EXISTS "${DEFAULT_DB_NAME}"`)
  await client.query(`CREATE DATABASE "${DEFAULT_DB_NAME}"`)
  const dbUrl = `postgres://${client.user}${
    client.password ? `:${client.password}` : ""
  }@${client.host}:${client.port}/${DEFAULT_DB_NAME}`
  await client.end()
  return dbUrl
}

describe("create-medusa-app command", () => {
  afterEach(async () => {
    // delete database if set in the project
    await dropDb()
    // delete project's directory
    await rm(projectPath, {
      recursive: true,
      force: true
    })
    // delete next.js project directory if exists
    await rm(nextjsPath, {
      recursive: true,
      force: true
    })
  })

  // TODO add tests for seed and boilerplate options 
  // once we support them again

  it("should create project", async () => {
    const logs = await runCLI()
    expect(logs).toContain(SUCCESS_MESSAGE)
  })

  it("should skip database creation", async () => {
    const logs = await runCLI([
      `--skip-db`
    ])
    expect(logs).toContain(SUCCESS_MESSAGE)
    expect(await getProjectDbUrl()).toBeUndefined()
  })

  it("should connect to supplied database URL", async () => {
    const dbUrl = await createDb()

    const logs = await runCLI([
      `--db-url`,
      dbUrl
    ])
    expect(logs).toContain(SUCCESS_MESSAGE)
  })

  it("shouldn't run migrations", async () => {
    const logs = await runCLI([
      `--no-migrations`,
    ])
    expect(logs).not.toContain(MIGRATIONS_MESSAGE)
  })

  it("should install with next.js", async () => {
    const logs = await runCLI([
      `--with-nextjs-starter`,
    ])
    expect(logs).toContain(SUCCESS_MESSAGE)
    expect(async () => {
      await stat(nextjsPath)
    }).not.toThrow()
  })
})