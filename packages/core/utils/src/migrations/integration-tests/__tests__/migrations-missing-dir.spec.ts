import { access, rm } from "fs/promises"
import { join } from "path"
import { createDatabase, dropDatabase } from "pg-god"

import { Migrations } from "../../index"
import { mikroOrmCreateConnection } from "../../../dal/mikro-orm/mikro-orm-create-connection"

jest.setTimeout(30000)

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? " "
process.env.DB_PASSWORD = DB_PASSWORD

const dbName = "my-test-migrations-missing-dir"
const migrationsPath = join(__dirname, "./missing-dir-migrations")

const pgGodCredentials = {
  user: DB_USERNAME ?? "postgres",
  password: DB_PASSWORD ?? "",
  host: DB_HOST,
}

const exists = (path: string) =>
  access(path)
    .then(() => true)
    .catch(() => false)

const createConnection = () =>
  mikroOrmCreateConnection(
    {
      clientUrl: `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${dbName}`,
      snapshot: false,
    },
    [],
    migrationsPath
  )

describe("Migrations - missing migrations directory", () => {
  beforeEach(async () => {
    await rm(migrationsPath, { recursive: true, force: true })
    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
    await createDatabase({ databaseName: dbName }, pgGodCredentials)
  })

  afterEach(async () => {
    await rm(migrationsPath, { recursive: true, force: true })
    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
  })

  it("should not create the migrations directory when running migrations", async () => {
    const results = await new Migrations(await createConnection()).run()

    expect(results).toEqual([])
    expect(await exists(migrationsPath)).toBe(false)
  })

  it("should not create the migrations directory when reverting migrations", async () => {
    const results = await new Migrations(await createConnection()).revert()

    expect(results).toEqual([])
    expect(await exists(migrationsPath)).toBe(false)
  })
})
