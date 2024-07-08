import { join } from "path"
import { setTimeout } from "timers/promises"
import { MetadataStorage } from "@mikro-orm/core"
import { createDatabase, dropDatabase } from "pg-god"

import { Migrations } from "../../index"
import { FileSystem } from "../../../common"
import { DmlEntity, model } from "../../../dml"
import { defineMikroOrmCliConfig } from "../../../modules-sdk"

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? " "
process.env.DB_PASSWORD = DB_PASSWORD

const dbName = "my-test-service"
const moduleName = "myTestService"
const fs = new FileSystem(join(__dirname, "./migrations"))

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

export function getDatabaseURL(): string {
  return `postgres://${DB_USERNAME}${
    DB_PASSWORD ? `:${DB_PASSWORD}` : ""
  }@${DB_HOST}/${dbName}`
}

describe("Generate migrations", () => {
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

  test("generate migrations for a single entity", async () => {
    const User = model.define("User", {
      id: model.id().primaryKey(),
      email: model.text().unique(),
      fullName: model.text().nullable(),
    })

    const config = defineMikroOrmCliConfig(moduleName, {
      clientUrl: getDatabaseURL(),
      entities: [User],
      databaseName: dbName,
      migrations: {
        path: fs.basePath,
      },
    })

    const migrations = new Migrations(config)
    const results = await migrations.generate()

    expect(await fs.exists(results.fileName))
    expect(await fs.contents(results.fileName)).toMatch(
      /create table if not exists "user"/
    )
  })

  test("generate migrations for multiple entities", async () => {
    const User = model
      .define("User", {
        id: model.id().primaryKey(),
        email: model.text().unique(),
        fullName: model.text().nullable(),
        cars: model.hasMany(() => Car),
      })
      .cascades({
        delete: ["cars"],
      })

    const Car = model.define("Car", {
      id: model.id().primaryKey(),
      name: model.text(),
      user: model.belongsTo(() => User, { mappedBy: "cars" }),
    })

    const config = defineMikroOrmCliConfig(moduleName, {
      clientUrl: getDatabaseURL(),
      entities: [User, Car],
      databaseName: dbName,
      migrations: {
        path: fs.basePath,
      },
    })

    const migrations = new Migrations(config)
    const results = await migrations.generate()

    expect(await fs.exists(results.fileName))
    expect(await fs.contents(results.fileName)).toMatch(
      /create table if not exists "user"/
    )
    expect(await fs.contents(results.fileName)).toMatch(
      /create table if not exists "car"/
    )
  })

  test("generate new file when entities are added", async () => {
    function run(entities: DmlEntity<any, any>[]) {
      const config = defineMikroOrmCliConfig(moduleName, {
        clientUrl: getDatabaseURL(),
        entities,
        databaseName: dbName,
        migrations: {
          path: fs.basePath,
        },
      })

      const migrations = new Migrations(config)
      return migrations.generate()
    }

    const User = model.define("User", {
      id: model.id().primaryKey(),
      email: model.text().unique(),
      fullName: model.text().nullable(),
    })

    const run1 = await run([User])
    expect(await fs.exists(run1.fileName))

    const Car = model.define("Car", {
      id: model.id().primaryKey(),
      name: model.text(),
    })

    await setTimeout(1000)

    const run2 = await run([User, Car])
    expect(await fs.exists(run2.fileName))

    expect(run1.fileName).not.toEqual(run2.fileName)
  })
})
