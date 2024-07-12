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
  join(__dirname, "../../integration-tests-migrations-many-to-many")
)

describe("manyToMany - manyToMany", () => {
  const dbName = "EntityBuilder-ManyToMany"

  let orm!: MikroORM

  let Team: EntityConstructor<any>,
    User: EntityConstructor<any>,
    Squad: EntityConstructor<any>

  afterAll(async () => {
    await fileSystem.cleanup()
  })

  beforeEach(async () => {
    MetadataStorage.clear()

    const team = model.define("team", {
      id: model.id().primaryKey(),
      name: model.text(),
      users: model.manyToMany(() => user, {
        pivotEntity: () => squad,
        mappedBy: "squads",
      }),
    })

    const squad = model.define("teamUsers", {
      id: model.id().primaryKey(),
      user: model.belongsTo(() => user, { mappedBy: "squads" }),
      squad: model.belongsTo(() => team, { mappedBy: "users" }),
    })

    const user = model.define("user", {
      id: model.id().primaryKey(),
      username: model.text(),
      squads: model.manyToMany(() => team, {
        pivotEntity: () => squad,
        mappedBy: "users",
      }),
    })

    ;[User, Squad, Team] = toMikroOrmEntities([user, squad, team])

    await createDatabase({ databaseName: dbName }, pgGodCredentials)

    orm = await MikroORM.init({
      entities: [Team, User, Squad],
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
    })
    const team2 = manager.create(Team, {
      name: "Team 2",
    })

    await manager.persistAndFlush([team1, team2])
    manager = orm.em.fork()

    const squad1 = manager.create(Squad, {
      user_id: user1.id,
      squad_id: team1.id,
    })
    const squad2 = manager.create(Squad, {
      user_id: user2.id,
      squad_id: team1.id,
    })

    await manager.persistAndFlush([squad1, squad2])
    manager = orm.em.fork()

    const team = await manager.findOne(
      Team,
      {
        id: team1.id,
      },
      {
        populate: ["users"],
      }
    )

    const serializedSquad = mikroOrmSerializer<InstanceType<typeof Team>>(team)

    expect(serializedSquad.users).toHaveLength(2)
    expect(serializedSquad).toEqual({
      id: team1.id,
      name: "Team 1",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
      users: expect.arrayContaining([
        {
          id: user1.id,
          username: "User 1",
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
        },
        {
          id: user2.id,
          username: "User 2",
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
        },
      ]),
    })

    const user = await manager.findOne(
      User,
      {
        id: user1.id,
      },
      {
        populate: ["squads"],
      }
    )

    const serializedUser = mikroOrmSerializer<InstanceType<typeof User>>(user)

    expect(serializedUser.squads).toHaveLength(1)
    expect(serializedUser).toEqual({
      id: user1.id,
      username: "User 1",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
      squads: expect.arrayContaining([
        {
          id: team1.id,
          name: "Team 1",
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          deleted_at: null,
        },
      ]),
    })
  })
})
