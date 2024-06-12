import execa from "execa"
import path from "path"
import { 
  rm, 
  readFile, 
  stat, 
  readdir,
  mkdir
} from "fs/promises"
import pg from "pg"
const { Client } = pg

const DB_REGEX = /DATABASE_URL=(?<url>.+)/
const DEFAULT_PROJECT_NAME = "my-medusa-store"
const DEFAULT_NEXTJS_PROJECT_NAME = `${DEFAULT_PROJECT_NAME}-storefront`
const DEFAULT_DB_NAME = "cma-test"
// snippet of the success message
const SUCCESS_MESSAGE = "directory to explore your Medusa"
const MIGRATIONS_MESSAGE = "Running Migrations..."
const basePath = path.resolve(__dirname, "../../")
const baesProjectsPath = path.resolve(basePath, `cma-tests`)
let testIncrement = 0

const createDirIfNotExists = async (path: string) => {
  try {
    await stat(path)
  } catch (e) {
    // directory doesn't exist, create it
    await mkdir(path)
  }
}

const runCLI = async (options: string[] = []): Promise<{
  logs: string | undefined
  projectPath: string
}> => {
  const params = ["dev", "--quiet", "--no-browser", ...options]
  const projectPath = path.join(baesProjectsPath, `${testIncrement++}`)
  await createDirIfNotExists(projectPath)
  params.push(`--directory-path`, projectPath)
  try {
    const { all: logs } = await execa("yarn", params, {
      all: true,
      cwd: basePath,
      env: {
        // avoid overlapping with other medusa tests
        PORT: "9001"
      }
    })

    return {
      logs,
      projectPath
    }
  } catch (err: any) {
    throw new Error(err.message + err.all)
  }
}

const getProjectDbUrl = async (
  projectPath: string
): Promise<string | undefined> => {
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

const dropDb = async (projectPath: string) => {
  const dbUrl = await getProjectDbUrl(projectPath)
  if (!dbUrl) {
    return
  }

  // extract db name from url
  const dbName = dbUrl.substring(dbUrl.lastIndexOf("/") + 1)

  // delete the database
  const client = new Client({
    connectionString: dbUrl.replace(`/${dbName}`, "")
  })

  await client.connect()
  await client.query(`DROP DATABASE "${dbName}"`)
  await client.end()
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
  beforeAll(async () => {
    await createDirIfNotExists(baesProjectsPath)
  })

  afterAll(async () => {
    // clear directories in the base directory
    readdir(baesProjectsPath, {
      withFileTypes: true
    })
    .then(async (files) => {
      await Promise.all(
        files.map(async (file) => {
          if (!file.isDirectory()) {
            return
          }

          await dropDb(path.join(
            baesProjectsPath, 
            file.name, 
            DEFAULT_PROJECT_NAME
          ))
        })
      )
    })

    // delete base projects directory
    await rm(baesProjectsPath, {
      recursive: true,
      force: true
    })
  })

  // TODO add tests for seed and boilerplate options 
  // once we support them again

  it("should create project", async () => {
    const { logs } = await runCLI()
    expect(logs).toContain(SUCCESS_MESSAGE)
  })

  it("should skip database creation", async () => {
    const { logs, projectPath } = await runCLI([
      `--skip-db`
    ])
    expect(logs).toContain(SUCCESS_MESSAGE)
    expect(await getProjectDbUrl(path.join(
      projectPath, DEFAULT_PROJECT_NAME
    ))).toBeUndefined()
  })

  it("should connect to supplied database URL", async () => {
    const dbUrl = await createDb()

    const { logs } = await runCLI([
      `--db-url`,
      dbUrl
    ])
    expect(logs).toContain(SUCCESS_MESSAGE)
  })

  it("shouldn't run migrations", async () => {
    const { logs } = await runCLI([
      `--no-migrations`,
    ])
    expect(logs).not.toContain(MIGRATIONS_MESSAGE)
  })

  // it("should install with next.js", async () => {
  //   const { logs, projectPath } = await runCLI([
  //     `--with-nextjs-starter`,
  //   ])
  //   expect(logs).toContain(SUCCESS_MESSAGE)
  //   expect(async () => {
  //     await stat(
  //       path.join(projectPath, DEFAULT_NEXTJS_PROJECT_NAME)
  //     )
  //   }).not.toThrow()
  // })
})