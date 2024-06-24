import { MikroORM } from "@mikro-orm/core"
import { model } from "../entity-builder"
import { createMikrORMEntity } from "../helpers/create-mikro-orm-entity"

describe("Entity builder", () => {
  describe("relations integrations", () => {
    describe("manyToOne - belongTo", () => {
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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      const Team = entityBuilder(team)

      let orm!: MikroORM

      beforeEach(async () => {
        orm = await MikroORM.init({
          entities: [Team, User],
          tsNode: true,
          dbName: "EntityBuilder-ManyToOne",
          type: "postgresql",
        })
      })

      afterEach(async () => {
        await orm.close()
      })

      it(`should handle the relation properly`, async () => {
        const manager = orm.em.fork()

        const user1 = manager.create<typeof User>("User", {
          username: "User 1",
        })
        const user2 = manager.create<typeof User>("User", {
          username: "User 2",
        })

        const team1 = manager.create<typeof Team>("Team", {
          name: "Team 1",
          user_id: user1.id,
        })
        const team2 = manager.create<typeof Team>("Team", {
          name: "Team 2",
          user_id: user2.id,
        })

        const team = await manager.findOne(
          team1.id,
          {},
          {
            populate: ["users"],
          }
        )

        expect(team).toEqual({
          id: team1.id,
          name: "Team 1",
          users: [
            {
              id: user1.id,
              username: "User 1",
            },
            {
              id: user2.id,
              username: "User 2",
            },
          ],
        })

        const user = await manager.findOne(
          user1.id,
          {},
          {
            populate: ["teams"],
          }
        )
        expect(user).toEqual({
          id: user1.id,
          username: "User 1",
          teams: [
            {
              id: team1.id,
              name: "Team 1",
            },
          ],
        })
      })
    })
  })
})
