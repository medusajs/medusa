import { join } from "path"
import { MikroORM } from "@mikro-orm/postgresql"
import { MetadataStorage } from "@mikro-orm/core"
import { createDatabase, dropDatabase } from "pg-god"
import { TSMigrationGenerator } from "@mikro-orm/migrations"

import { model } from "../../../dml"
import { FileSystem } from "../../../common"
import { Migrations, MigrationsEvents } from "../../index"
import { defineMikroOrmCliConfig } from "../../../modules-sdk"

const migrationFileNameGenerator = (_: string, name?: string) => {
  return `Migration${new Date().getTime()}${name ? `_${name}` : ""}`
}

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? " "
process.env.DB_PASSWORD = DB_PASSWORD

const dbName = "my-test-service-run"
const moduleName = "myTestServiceRun"
const fs = new FileSystem(join(__dirname, "./migrations-run"))

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

describe("Run migrations", () => {
  beforeEach(async () => {
    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
    await fs.cleanup()
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
        fileName: migrationFileNameGenerator,
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
        fileName: migrationFileNameGenerator,
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

  test("throw error when migration fails during run", async () => {
    /**
     * Custom strategy to output invalid SQL statement inside the
     * migration file
     */
    class CustomTSMigrationGenerator extends TSMigrationGenerator {
      createStatement(sql: string, padLeft: number): string {
        let output = super.createStatement(sql, padLeft)
        return output.replace('"user"', '"foo";')
      }
    }

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
        generator: CustomTSMigrationGenerator,
        fileName: migrationFileNameGenerator,
      },
      ...pgGodCredentials,
    })

    const migrations = new Migrations(config)
    await migrations.generate()

    expect(migrations.run()).rejects.toThrow(/.*Migration.*/)

    const orm = await MikroORM.init(config)
    const usersTableExists = await orm.em.getKnex().schema.hasTable("user")

    await orm.close()

    expect(usersTableExists).toEqual(false)
  })
})
