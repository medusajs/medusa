import {
  CheckConstraintViolationException,
  MetadataStorage,
  MikroORM,
} from "@mikro-orm/core"
import { model } from "../../entity-builder"
import { toMikroOrmEntities } from "../../helpers/create-mikro-orm-entity"
import { createDatabase, dropDatabase } from "pg-god"
import { CustomTsMigrationGenerator, mikroOrmSerializer } from "../../../dal"
import { EntityConstructor } from "@medusajs/types"
import { pgGodCredentials } from "../utils"
import { FileSystem } from "../../../common"
import { join } from "path"

export const fileSystem = new FileSystem(
  join(__dirname, "../../integration-tests-migrations-enum")
)

describe("EntityBuilder | enum", () => {
  const dbName = "EntityBuilder-enum"

  let orm!: MikroORM
  let User: EntityConstructor<any>

  afterAll(async () => {
    await fileSystem.cleanup()
  })

  beforeEach(async () => {
    MetadataStorage.clear()

    const user = model.define("user", {
      id: model.id().primaryKey(),
      username: model.text(),
      role: model.enum(["admin", "moderator", "editor"]),
    })

    ;[User] = toMikroOrmEntities([user])

    await createDatabase({ databaseName: dbName }, pgGodCredentials)

    orm = await MikroORM.init({
      entities: [User],
      tsNode: true,
      dbName,
      password: pgGodCredentials.password,
      host: pgGodCredentials.host,
      user: pgGodCredentials.user,
      type: "postgresql",
      migrations: {
        generator: CustomTsMigrationGenerator,
        path: fileSystem.basePath,
      },
    })

    const migrator = orm.getMigrator()
    await migrator.createMigration()
    await migrator.up()
  })

  afterEach(async () => {
    await orm.close()

    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
  })

  it(`should handle the enum property`, async () => {
    let manager = orm.em.fork()

    const user1 = manager.create(User, {
      username: "User 1",
      role: "admin",
    })

    await manager.persistAndFlush([user1])
    manager = orm.em.fork()

    const user = await manager.findOne(User, {
      id: user1.id,
    })

    expect(mikroOrmSerializer<InstanceType<typeof User>>(user)).toEqual({
      id: user1.id,
      username: "User 1",
      role: "admin",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
    })
  })

  it(`should fail to handle the enum property`, async () => {
    let manager = orm.em.fork()

    const user1 = manager.create(User, {
      username: "User 1",
      role: "test",
    })

    const err = await manager.persistAndFlush([user1]).catch((e) => e)

    expect(err.name).toEqual(CheckConstraintViolationException.name)
  })
})
