import { MetadataStorage } from "@medusajs/deps/mikro-orm/core"
import { join } from "path"
import { setTimeout } from "timers/promises"

import { FileSystem } from "../../../common"
import {
  DmlEntity,
  mikroORMEntityBuilder,
  model,
  toMikroOrmEntities,
} from "../../../dml"
import { defineMikroOrmCliConfig } from "../../../modules-sdk"
import { BigNumber } from "../../../totals/big-number"
import { mikroOrmCreateConnection } from "../../../dal"
import { Migrations } from "../../index"

class TestMigrations extends Migrations {
  async callMigrateSnapshotFile(snapshotPath: string) {
    return this.migrateSnapshotFile(snapshotPath)
  }
}

jest.setTimeout(30000)

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? " "

const dbName = "my-test-service-generate"
const moduleName = "myTestServiceGenerate"
const fs = new FileSystem(join(__dirname, "./migrations-generate"))

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

describe("Generate migrations", () => {
  beforeEach(async () => {
    await fs.cleanup()
  })

  afterEach(async () => {
    await fs.cleanup()
    MetadataStorage.clear()
    mikroORMEntityBuilder.clear()
  })

  test("generate migrations for a single entity", async () => {
    const User = model.define("User", {
      id: model.id().primaryKey(),
      email: model.text().unique(),
      fullName: model.text().nullable(),
      numericFieldNoDefault: model.number(),
      numericField: model.number().default(0),
      numericFieldNullable: model.number().default(1).nullable(),
      bigNumberFieldNoDefault: model.bigNumber(),
      bigNumberField: model
        .bigNumber()
        .default(
          new BigNumber(
            "892.87896454789798987789789789541354687681246874956165789639",
            { precision: 50 }
          )
        ),
      bigNumberFieldNullable: model.bigNumber().default(3).nullable(),
      bigNumberWithString: model.bigNumber().default("5789.6547899").nullable(),
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
    const results = await migrations.generate()

    expect(await fs.exists(results.fileName))
    const migrationFile = await fs.contents(results.fileName)

    expect(migrationFile).toMatch(/create table if not exists "user"/)
    expect(migrationFile).toMatch(/"numericFieldNoDefault" integer not null/)
    expect(migrationFile).toMatch(/"numericField" integer not null default 0/)
    expect(migrationFile).toMatch(
      /"numericFieldNullable" integer null default 1/
    )
    expect(migrationFile).toMatch(
      /"bigNumberWithString" numeric null default '5789\.6547899'/
    )
    expect(migrationFile).toMatch(
      /"bigNumberField" numeric not null default 892\.878964547898/
    )
    expect(migrationFile).toMatch(
      /"bigNumberFieldNullable" numeric null default 3/
    )
    expect(migrationFile).toMatch(/"bigNumberFieldNoDefault" numeric not null/)
    expect(migrationFile).toMatch(
      /"raw_bigNumberField" jsonb not null default '{"value":"892\.87896454789798987789789789541354687681246874956","precision":50}'/
    )
    expect(migrationFile).toMatch(
      /"raw_bigNumberFieldNullable" jsonb null default '{"value":"3","precision":20}'/
    )
    expect(migrationFile).toMatch(
      /"raw_bigNumberWithString" jsonb null default '{"value":"5789\.6547899","precision":20}'/
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
      entities: [User, Car],
      dbName: dbName,
      migrations: {
        path: fs.basePath,
      },
      ...pgGodCredentials,
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
    async function run(entities: DmlEntity<any, any>[]) {
      const config = defineMikroOrmCliConfig(moduleName, {
        entities,
        dbName: dbName,
        migrations: {
          path: fs.basePath,
        },
        ...pgGodCredentials,
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

  test("snapshot file is named after the module name, not the database name", async () => {
    const User = model.define("User", {
      id: model.id().primaryKey(),
      email: model.text().unique(),
    })

    /**
     * Simulate what buildGenerateMigrationScript does: pass snapshotName
     * derived from the module key so the snapshot is always named after
     * the module, never after the runtime database name.
     */
    const moduleKey = "my-custom-module"
    const orm = await mikroOrmCreateConnection(
      {
        clientUrl: `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${dbName}`,
        snapshotName: `.snapshot-${moduleKey}`,
      },
      toMikroOrmEntities([User]),
      fs.basePath
    )

    const migrations = new Migrations(orm)
    await migrations.generate()

    expect(await fs.exists(`.snapshot-${moduleKey}.json`)).toBeTruthy()
    // Must not fall back to a DB-name-based snapshot
    expect(await fs.exists(`.snapshot-${dbName}.json`)).toBeFalsy()
  })

  test("rename existing snapshot file to the new filename (plugins)", async () => {
    // Legacy snapshot name: no medusa- prefix, matching the module name
    await fs.createJson(".snapshot-my-test-generate.json", {
      tables: [],
      namespaces: [],
    })

    async function run(entities: DmlEntity<any, any>[]) {
      const config = defineMikroOrmCliConfig(moduleName, {
        entities,
        dbName: dbName,
        migrations: {
          path: fs.basePath,
        },
        ...pgGodCredentials,
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
    expect(await fs.exists(".snapshot-my-test-generate.json")).toBeFalsy()
    expect(
      await fs.exists(".snapshot-medusa-my-test-generate.json")
    ).toBeTruthy()

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

describe("migrateSnapshotFile", () => {
  const snapshotFs = new FileSystem(join(__dirname, "./migrations-snapshot"))

  beforeEach(async () => {
    await snapshotFs.cleanup()
  })

  afterEach(async () => {
    await snapshotFs.cleanup()
  })

  test("preserves correct module snapshot when a DB-name snapshot also exists", async () => {
    const moduleSnapshotName = ".snapshot-my-module.json"
    const dbSnapshotName = ".snapshot-medusa-my-module.json"

    await snapshotFs.createJson(moduleSnapshotName, {
      tables: ["user"],
      namespaces: [],
    })
    await snapshotFs.createJson(dbSnapshotName, {
      tables: ["user", "order", "cart"],
      namespaces: [],
    })

    const migrations = new TestMigrations({})
    await migrations.callMigrateSnapshotFile(
      join(snapshotFs.basePath, moduleSnapshotName)
    )

    // Module snapshot must be untouched
    const content = await snapshotFs.contentsJson(moduleSnapshotName)
    expect(content.tables).toEqual(["user"])

    // DB-name snapshot must still exist (not deleted or renamed)
    expect(await snapshotFs.exists(dbSnapshotName)).toBeTruthy()
  })

  test("does not rename a DB-name snapshot to the module snapshot name", async () => {
    const moduleSnapshotName = ".snapshot-my-module.json"
    const dbSnapshotName = ".snapshot-medusa-my-module.json"

    await snapshotFs.createJson(dbSnapshotName, {
      tables: ["user", "order", "cart"],
      namespaces: [],
    })

    const migrations = new TestMigrations({})
    await migrations.callMigrateSnapshotFile(
      join(snapshotFs.basePath, moduleSnapshotName)
    )

    // DB-name snapshot must NOT have been renamed to the module snapshot name
    expect(await snapshotFs.exists(moduleSnapshotName)).toBeFalsy()
    expect(await snapshotFs.exists(dbSnapshotName)).toBeTruthy()
  })

  test("renames legacy plugin snapshot (no medusa- prefix) to the new plugin snapshot name (with medusa- prefix)", async () => {
    const legacySnapshotName = ".snapshot-my-module.json"
    const newSnapshotName = ".snapshot-medusa-my-module.json"

    await snapshotFs.createJson(legacySnapshotName, {
      tables: ["user"],
      namespaces: [],
    })

    const migrations = new TestMigrations({})
    await migrations.callMigrateSnapshotFile(
      join(snapshotFs.basePath, newSnapshotName)
    )

    expect(await snapshotFs.exists(newSnapshotName)).toBeTruthy()
    expect(await snapshotFs.exists(legacySnapshotName)).toBeFalsy()
  })
})
