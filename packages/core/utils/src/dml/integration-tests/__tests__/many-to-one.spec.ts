import { EntityConstructor } from "@zjedene-medusa/types"
import { MetadataStorage, MikroORM } from "@zjedene-medusa/deps/mikro-orm/core"
import {
  defineConfig,
  SqlEntityManager,
} from "@zjedene-medusa/deps/mikro-orm/postgresql"
import { join } from "path"
import { createDatabase, dropDatabase } from "pg-god"
import { FileSystem } from "../../../common"
import {
  CustomTsMigrationGenerator,
  mikroOrmSerializer,
  mikroOrmUpdateDeletedAtRecursively,
  SoftDeletableFilterKey,
} from "../../../dal"
import { model } from "../../entity-builder"
import {
  mikroORMEntityBuilder,
  toMikroOrmEntities,
} from "../../helpers/create-mikro-orm-entity"
import { pgGodCredentials } from "../utils"

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
    mikroORMEntityBuilder.clear()

    const team = model.define("team", {
      id: model.id().primaryKey(),
      name: model.text(),
      user: model.belongsTo(() => user, { mappedBy: "teams" }),
    })

    const user = model
      .define("user", {
        id: model.id().primaryKey(),
        username: model.text(),
        teams: model.hasMany(() => team, { mappedBy: "user" }),
      })
      .cascades({
        delete: ["teams"],
      })

    ;[User, Team] = toMikroOrmEntities([user, team])

    await createDatabase({ databaseName: dbName }, pgGodCredentials)

    orm = await MikroORM.init(
      defineConfig({
        entities: [Team, User],
        tsNode: true,
        dbName,
        password: pgGodCredentials.password,
        host: pgGodCredentials.host,
        user: pgGodCredentials.user,
        migrations: {
          generator: CustomTsMigrationGenerator,
          path: fileSystem.basePath,
        },
      })
    )

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

    expect(await mikroOrmSerializer<InstanceType<typeof Team>>(team)).toEqual({
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

    expect(await mikroOrmSerializer<InstanceType<typeof User>>(user)).toEqual({
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

  it(`should handle soft delete cascade`, async () => {
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
    const team2 = manager.create(Team, {
      name: "Team 2",
      user_id: user1.id,
    })

    await manager.persistAndFlush([team1, team2])
    manager = orm.em.fork()

    let teams = await manager.find(
      Team,
      {},
      {
        populate: ["user"],
      }
    )

    const serializedTeams = await mikroOrmSerializer<InstanceType<typeof Team>>(
      teams
    )
    expect(serializedTeams).toHaveLength(2)
    expect(serializedTeams).toEqual(
      expect.arrayContaining([
        {
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
        },
        {
          id: team2.id,
          name: "Team 2",
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
        },
      ])
    )

    manager = orm.em.fork()
    const userToDelete = await manager.findOne(User, {
      id: user1.id,
    })
    await mikroOrmUpdateDeletedAtRecursively(
      manager as SqlEntityManager,
      [userToDelete],
      new Date()
    )

    teams = await manager.find(
      Team,
      {},
      {
        populate: ["user"],
        filters: {
          [SoftDeletableFilterKey]: {
            withDeleted: true,
          },
        },
      }
    )

    expect(teams).toHaveLength(2)
    expect(teams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          deleted_at: expect.any(Date),
          user: expect.objectContaining({
            deleted_at: expect.any(Date),
          }),
        }),
        expect.objectContaining({
          deleted_at: expect.any(Date),
          user: expect.objectContaining({
            deleted_at: expect.any(Date),
          }),
        }),
      ])
    )
  })
})
