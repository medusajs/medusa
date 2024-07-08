import { join } from "path"
import { MikroORM } from "@mikro-orm/postgresql"
import { MetadataStorage } from "@mikro-orm/core"
import { createDatabase, dropDatabase } from "pg-god"

import { model } from "../../../dml"
import { FileSystem } from "../../../common"
import { Migrations, MigrationsEvents } from "../../index"
import { defineMikroOrmCliConfig } from "../../../modules-sdk"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? " "

const dbName = "my-test-service-revert"
const moduleName = "myTestServiceRevert"
const fs = new FileSystem(join(__dirname, "./migrations/revert"))

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

describe("Revert migrations", () => {
  beforeEach(async () => {
    await createDatabase({ databaseName: dbName }, pgGodCredentials)
  })

  afterEach(async () => {
    await fs.cleanup()
    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
    MetadataStorage.clear()
  }, 300 * 1000)

  test("revert migrations", async () => {
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
    await migrations.run()
    const results = await migrations.revert()

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
    expect(usersTableExists).toEqual(false)
  })

  // test("emit events during revert", async () => {
  //   let events: {
  //     event: keyof MigrationsEvents
  //     payload: MigrationsEvents[keyof MigrationsEvents][number]
  //   }[] = []

  //   const User = model.define("User", {
  //     id: model.id().primaryKey(),
  //     email: model.text().unique(),
  //     fullName: model.text().nullable(),
  //   })

  //   const config = defineMikroOrmCliConfig(moduleName, {
  //     entities: [User],
  //     dbName: dbName,
  //     migrations: {
  //       path: fs.basePath,
  //     },
  //     ...pgGodCredentials,
  //   })

  //   const migrations = new Migrations(config)

  //   migrations.on("reverting", (event) => {
  //     events.push({ event: "reverting", payload: event })
  //   })
  //   migrations.on("reverted", (event) => {
  //     events.push({ event: "reverted", payload: event })
  //   })

  //   await migrations.generate()
  //   await migrations.run()
  //   await migrations.revert()

  //   expect(events).toHaveLength(2)

  //   expect(events[0].event).toEqual("reverting")
  //   expect(events[0].payload).toEqual({
  //     name: expect.stringMatching(/Migration\d+/),
  //     path: expect.stringContaining(__dirname),
  //     context: {},
  //   })

  //   expect(events[1].event).toEqual("reverted")
  //   expect(events[1].payload).toEqual({
  //     name: expect.stringMatching(/Migration\d+/),
  //     path: expect.stringContaining(__dirname),
  //     context: {},
  //   })
  // })

  // test("throw error when migration fails during revert", async () => {
  //   const User = model.define("User", {
  //     id: model.id().primaryKey(),
  //     email: model.text().unique(),
  //     fullName: model.text().nullable(),
  //   })

  //   const config = defineMikroOrmCliConfig(moduleName, {
  //     entities: [User],
  //     dbName: dbName,
  //     migrations: {
  //       path: fs.basePath,
  //     },
  //     ...pgGodCredentials,
  //   })

  //   const migrations = new Migrations(config)
  //   const generatedFile = await migrations.generate()

  //   /**
  //    * Corrupting file intentionally so that it will raise an error
  //    * during revert
  //    */
  //   await fs.create(
  //     generatedFile.fileName,
  //     generatedFile.code.replace("drop table if exists", "drop foo")
  //   )

  //   await migrations.run()
  //   expect(migrations.revert()).rejects.toThrow("Migration")

  //   const orm = await MikroORM.init(config)
  //   const usersTableExists = await orm.em.getKnex().schema.hasTable("user")
  //   await orm.close()

  //   expect(usersTableExists).toEqual(true)
  // })
})
