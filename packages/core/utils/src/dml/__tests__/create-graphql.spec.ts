import { model } from "../entity-builder"
import { generateGraphQLFromEntity } from "../helpers/create-graphql"

describe("GraphQL builder", () => {
  test("define an entity", () => {
    const user = model.define("user", {
      id: model.id(),
      username: model.text(),
      email: model.text(),
      spend_limit: model.bigNumber(),
      phones: model.array(),
      group: model.belongsTo(() => group, { mappedBy: "users" }),
    })

    const group = model.define("group", {
      id: model.number(),
      name: model.text(),
      users: model.hasMany(() => user),
    })

    const User = generateGraphQLFromEntity()
    const Group = generateGraphQLFromEntity()

    try {
      console.log(User(user))
    } catch {}

    try {
      console.log(Group(group))
    } catch {}
  })
})
