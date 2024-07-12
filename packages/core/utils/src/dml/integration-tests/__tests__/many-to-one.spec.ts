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
  join(__dirname, "../../integration-tests-migrations-many-to-one")
)

describe("manyToOne - belongTo", () => {
  const dbName = "EntityBuilder-ManyToOne"

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
      user: model.belongsTo(() => user, { mappedBy: "teams" }),
    })

    const user = model.define("user", {
      id: model.id().primaryKey(),
      username: model.text(),
      teams: model.hasMany(() => team, { mappedBy: "user" }),
    })

    ;[User, Team] = toMikroOrmEntities([user, team])

    await createDatabase({ databaseName: dbName }, pgGodCredentials)

    orm = await MikroORM.init({
      entities: [Team, User],
      tsNode: true,
      dbName,
      debug: true,
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
    })
    const user2 = manager.create(User, {
      username: "User 2",
    })

    await manager.persistAndFlush([user1, user2])
    manager = orm.em.fork()

    const team1 = manager.create(Team, {
      name: "Team 1",
      user_id: user1.id,
    })
    const team2 = manager.create(Team, {
      name: "Team 2",
      user_id: user2.id,
    })

    await manager.persistAndFlush([team1, team2])
    manager = orm.em.fork()

    const team = await manager.findOne(
      Team,
      {
        id: team1.id,
      },
      {
        populate: ["user"],
      }
    )

    expect(mikroOrmSerializer<InstanceType<typeof Team>>(team)).toEqual({
      id: team1.id,
      name: "Team 1",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
      user_id: user1.id,
      user: {
        id: user1.id,
        username: "User 1",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        deleted_at: null,
      },
    })

    const user = await manager.findOne(
      User,
      {
        id: user1.id,
      },
      {
        populate: ["teams"],
      }
    )

    expect(mikroOrmSerializer<InstanceType<typeof User>>(user)).toEqual({
      id: user1.id,
      username: "User 1",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
      teams: [
        {
          id: team1.id,
          name: "Team 1",
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
          user_id: user1.id,
        },
      ],
    })
  })
})
