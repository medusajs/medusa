import { join } from "path"
import { MetadataStorage } from "@mikro-orm/core"
import { createDatabase, dropDatabase } from "pg-god"

import { model } from "../../../dml"
import { Migrations, MigrationsEvents } from "../../index"
import { FileSystem } from "../../../common"
import { defineMikroOrmCliConfig } from "../../../modules-sdk"
import { MikroORM } from "@mikro-orm/postgresql"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? " "
process.env.DB_PASSWORD = DB_PASSWORD

const dbName = "my-test-service-run"
const moduleName = "myTestServiceRun"
const fs = new FileSystem(join(__dirname, "./migrations/run"))

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

describe("Run migrations", () => {
  beforeEach(async () => {
    await createDatabase({ databaseName: dbName }, pgGodCredentials)
  })

  afterEach(async () => {
    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
    await fs.cleanup()
    MetadataStorage.clear()
  }, 300 * 1000)

  test("run migrations after generating them", async () => {
    const User = model.define("User", {
      id: model.id().primaryKey(),
      email: model.text().unique(),
      fullName: model.text().nullable(),
    })

    const config = defineMikroOrmCliConfig(moduleName, {
      entities: [User],
      dbName: dbName,
      migrations: {
        path: fs.basePath,
      },
      ...pgGodCredentials,
    })

    const migrations = new Migrations(config)
    await migrations.generate()
    const results = await migrations.run()

    const orm = await MikroORM.init(config)
    const usersTableExists = await orm.em.getKnex().schema.hasTable("user")
    await orm.close()

    expect(results).toHaveLength(1)
    expect(results).toEqual([
      {
        name: expect.stringMatching(/Migration\d+/),
        path: expect.stringContaining(__dirname),
      },
    ])
    expect(usersTableExists).toEqual(true)
  })

  test("emit events when running migrations", async () => {
    let events: {
      event: keyof MigrationsEvents
      payload: MigrationsEvents[keyof MigrationsEvents][number]
    }[] = []

    const User = model.define("User", {
      id: model.id().primaryKey(),
      email: model.text().unique(),
      fullName: model.text().nullable(),
    })

    const config = defineMikroOrmCliConfig(moduleName, {
      entities: [User],
      dbName: dbName,
      migrations: {
        path: fs.basePath,
      },
      ...pgGodCredentials,
    })

    const migrations = new Migrations(config)
    await migrations.generate()

    migrations.on("migrating", (event) => {
      events.push({ event: "migrating", payload: event })
    })
    migrations.on("migrated", (event) => {
      events.push({ event: "migrated", payload: event })
    })

    await migrations.run()
    expect(events).toHaveLength(2)

    expect(events[0].event).toEqual("migrating")
    expect(events[0].payload).toEqual({
      name: expect.stringMatching(/Migration\d+/),
      path: expect.stringContaining(__dirname),
      context: {},
    })

    expect(events[1].event).toEqual("migrated")
    expect(events[1].payload).toEqual({
      name: expect.stringMatching(/Migration\d+/),
      path: expect.stringContaining(__dirname),
      context: {},
    })
  })

  test.only("throw error when migration fails", async () => {
    const User = model.define("User", {
      id: model.id().primaryKey(),
      email: model.text().unique(),
      fullName: model.text().nullable(),
    })

    const config = defineMikroOrmCliConfig(moduleName, {
      entities: [User],
      dbName: dbName,
      migrations: {
        path: fs.basePath,
      },
      ...pgGodCredentials,
    })

    const migrations = new Migrations(config)
    const generatedFile = await migrations.generate()

    /**
     * Corrupting file intentionally so that it will raise an error
     */
    await fs.create(
      generatedFile.fileName,
      generatedFile.code.replace("create table if not exists", "create foo")
    )

    expect(migrations.run()).rejects.toThrow("Migration")

    const orm = await MikroORM.init(config)
    const usersTableExists = await orm.em.getKnex().schema.hasTable("user")
    await orm.close()

    expect(usersTableExists).toEqual(false)
  })
})
