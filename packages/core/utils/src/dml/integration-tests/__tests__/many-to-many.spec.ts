import { EntityConstructor } from "@zjedene-medusa/types"
import { MetadataStorage, MikroORM } from "@zjedene-medusa/deps/mikro-orm/core"
import { defineConfig } from "@zjedene-medusa/deps/mikro-orm/postgresql"
import { join } from "path"
import { createDatabase, dropDatabase } from "pg-god"
import { FileSystem } from "../../../common"
import { CustomTsMigrationGenerator, mikroOrmSerializer } from "../../../dal"
import { model } from "../../entity-builder"
import {
  mikroORMEntityBuilder,
  toMikroOrmEntities,
} from "../../helpers/create-mikro-orm-entity"
import { pgGodCredentials } from "../utils"

jest.setTimeout(30000)

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
    mikroORMEntityBuilder.clear()

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

    orm = await MikroORM.init(
      defineConfig({
        entities: [Team, User, Squad],
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

    const serializedSquad = await mikroOrmSerializer<InstanceType<typeof Team>>(
      team
    )

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

    const serializedUser = await mikroOrmSerializer<InstanceType<typeof User>>(
      user
    )

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

  it(`should not fail to load the dml's if both side of the relation are missing the mappedBy options`, () => {
    mikroORMEntityBuilder.clear()

    const team = model.define("team", {
      id: model.id().primaryKey(),
      name: model.text(),
      users: model.manyToMany(() => user, {
        pivot_table: "team_users",
      }),
    })

    const user = model.define("user", {
      id: model.id().primaryKey(),
      username: model.text(),
      squads: model.manyToMany(() => team),
    })

    ;[User, Team] = toMikroOrmEntities([user, team])

    const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
    expect((teamMetaData.properties as any).users.inversedBy).toBe("squads")
    expect((teamMetaData.properties as any).users.owner).toBe(true)

    const userMetaData = MetadataStorage.getMetadataFromDecorator(User)
    expect((userMetaData.properties as any).squads.inversedBy).not.toBeDefined()
    expect((userMetaData.properties as any).squads.mappedBy).toBe("users")
    expect((userMetaData.properties as any).squads.owner).toBe(false)
  })

  it(`should load the dml's correclty when both side of the relation are specifying the mappedBy options without pivot table`, () => {
    mikroORMEntityBuilder.clear()

    const team = model.define("team", {
      id: model.id().primaryKey(),
      name: model.text(),
      users: model.manyToMany(() => user, {
        mappedBy: "squads",
      }),
    })

    const user = model.define("user", {
      id: model.id().primaryKey(),
      username: model.text(),
      squads: model.manyToMany(() => team, {
        mappedBy: "users",
      }),
    })

    let [User, Team] = toMikroOrmEntities([user, team])

    const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
    expect((teamMetaData.properties as any).users.inversedBy).toBe("squads")
    expect((teamMetaData.properties as any).users.owner).toBe(true)
    expect((teamMetaData.properties as any).users.pivotTable).toBe("team_users")

    const userMetaData = MetadataStorage.getMetadataFromDecorator(User)
    expect((userMetaData.properties as any).squads.inversedBy).not.toBeDefined()
    expect((userMetaData.properties as any).squads.mappedBy).toBe("users")
    expect((userMetaData.properties as any).squads.owner).toBe(false)
    expect((userMetaData.properties as any).squads.pivotTable).toBe(
      "team_users"
    )
  })

  it(`should fail to load the dml's if both side of the relation are missing the mappedBy options and multiple relations points to the same entity`, () => {
    mikroORMEntityBuilder.clear()

    const team = model.define("team", {
      id: model.id().primaryKey(),
      name: model.text(),
      users: model.manyToMany(() => user, {
        pivot_table: "team_users",
      }),
      users2: model.manyToMany(() => user, {
        pivot_table: "team_users2",
      }),
    })

    const user = model.define("user", {
      id: model.id().primaryKey(),
      username: model.text(),
      squads: model.manyToMany(() => team),
      squads2: model.manyToMany(() => team),
    })

    let error!: Error

    try {
      ;[User, Team] = toMikroOrmEntities([user, team])
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    expect(error?.message).toEqual(
      'Invalid relationship reference for "User.squads". Make sure to set the mappedBy property on one side or the other or both.'
    )
  })

  it(`should fail to load the dml's if the relation is defined only on one side`, () => {
    mikroORMEntityBuilder.clear()

    const team = model.define("team", {
      id: model.id().primaryKey(),
      name: model.text(),
      users: model.manyToMany(() => user),
    })

    const user = model.define("user", {
      id: model.id().primaryKey(),
      username: model.text(),
    })

    let error!: Error
    try {
      ;[User, Team] = toMikroOrmEntities([user, team])
    } catch (e) {
      error = e
    }

    expect(error).toBeTruthy()
    expect(error.message).toEqual(
      'Invalid relationship reference for "Team.users". "mappedBy" should be defined on one side or the other.'
    )
  })
})
