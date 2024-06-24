import { MetadataStorage, MikroORM } from "@mikro-orm/core"
import { model } from "../entity-builder"
import { toMikroOrmEntities } from "../helpers/create-mikro-orm-entity"
import { createDatabase, dropDatabase } from "pg-god"
import { mikroOrmSerializer } from "../../dal"
import { FileSystem } from "../../common"
import { join } from "path"

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

const fileSystem = new FileSystem(join(__dirname, "../../migrations"))

describe("manyToOne - belongTo", () => {
  const dbName = "EntityBuilder-ManyToOne"

  let orm!: MikroORM
  let Team, User

  afterAll(() => {
    fileSystem.cleanup()
  })

  beforeEach(async () => {
    MetadataStorage.clear()

    const team = model.define("team", {
      id: model.id(),
      name: model.text(),
      user: model.belongsTo(() => user, { mappedBy: "teams" }),
    })

    const user = model.define("user", {
      id: model.id(),
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

    const user1 = manager.create<typeof User>("User", {
      username: "User 1",
    })
    const user2 = manager.create<typeof User>("User", {
      username: "User 2",
    })

    await manager.persistAndFlush([user1, user2])
    manager = orm.em.fork()

    const team1 = manager.create<typeof Team>("Team", {
      name: "Team 1",
      user_id: user1.id,
    })
    const team2 = manager.create<typeof Team>("Team", {
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

    expect(mikroOrmSerializer(team)).toEqual({
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

    expect(mikroOrmSerializer(user)).toEqual({
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
