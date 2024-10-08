import { MetadataStorage, MikroORM } from "@mikro-orm/core"
import { model } from "../../entity-builder"
import { toMikroOrmEntities } from "../../helpers/create-mikro-orm-entity"
import { createDatabase, dropDatabase } from "pg-god"
import { CustomTsMigrationGenerator, mikroOrmSerializer } from "../../../dal"
import { EntityConstructor } from "@medusajs/types"
import { pgGodCredentials } from "../utils"
import { FileSystem } from "../../../common"
import { join } from "path"

export const fileSystem = new FileSystem(
  join(__dirname, "../../integration-tests-migrations-has-one-belongs-to")
)

describe("hasOne - belongTo", () => {
  const dbName = "EntityBuilder-HasOneBelongsTo"

  let orm!: MikroORM
  let Team: EntityConstructor<any>, User: EntityConstructor<any>

  afterAll(async () => {
    await fileSystem.cleanup()
  })

  beforeEach(async () => {
    MetadataStorage.clear()

    const team = model.define("team", {
      id: model.id().primaryKey(),
      name: model.text(),
      user: model.belongsTo(() => user, { mappedBy: "team" }),
    })

    const user = model.define("user", {
      id: model.id().primaryKey(),
      username: model.text(),
      team: model.hasOne(() => team, { mappedBy: "user" }).nullable(),
    })

    ;[User, Team] = toMikroOrmEntities([user, team])

    await createDatabase({ databaseName: dbName }, pgGodCredentials)

    orm = await MikroORM.init({
      entities: [Team, User],
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

  it(`should handle the relation properly`, async () => {
    let manager = orm.em.fork()

    const user1 = manager.create(User, {
      username: "User 1",
      team: {
        name: "Team 1",
      },
    })

    await manager.persistAndFlush([user1])
    manager = orm.em.fork()

    const user = await manager.findOne(
      User,
      {
        id: user1.id,
      },
      {
        populate: ["team"],
      }
    )

    expect(await mikroOrmSerializer<InstanceType<typeof User>>(user)).toEqual({
      id: user1.id,
      username: "User 1",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
      team: {
        id: expect.any(String),
        name: "Team 1",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        deleted_at: null,
        user_id: user1.id,
      },
    })
  })

  it(`should handle the relation properly with just the relation id`, async () => {
    let manager = orm.em.fork()

    const user1 = manager.create(User, {
      username: "User 1",
    })

    await manager.persistAndFlush([user1])
    manager = orm.em.fork()

    const team1 = manager.create(Team, {
      name: "Team 1",
      user_id: user1.id,
    })

    await manager.persistAndFlush([team1])
    manager = orm.em.fork()

    const user = await manager.findOne(
      User,
      {
        id: user1.id,
      },
      {
        populate: ["team"],
      }
    )

    expect(await mikroOrmSerializer<InstanceType<typeof User>>(user)).toEqual({
      id: user1.id,
      username: "User 1",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
      team: {
        id: expect.any(String),
        name: "Team 1",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        deleted_at: null,
        user_id: user1.id,
      },
    })
  })
})
