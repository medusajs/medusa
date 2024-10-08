import { model } from "../entity-builder"
import { toGraphQLSchema } from "../helpers/create-graphql"

describe("GraphQL builder", () => {
  test("define an entity", () => {
    const tag = model.define("tag", {
      id: model.id(),
      value: model.text(),
    })

    const email = model.define("email", {
      email: model.text(),
      isVerified: model.boolean(),
    })

    const user = model.define("user", {
      id: model.id(),
      username: model.text(),
      email: model.hasOne(() => email, { mappedBy: "owner" }),
      spend_limit: model.bigNumber(),
      phones: model.array(),
      group: model.belongsTo(() => group, { mappedBy: "users" }),
      role: model
        .enum(["moderator", "admin", "guest", "new_user"])
        .default("guest"),
      tags: model.manyToMany(() => tag, {
        pivotTable: "custom_user_tags",
      }),
    })

    const group = model.define("group", {
      id: model.number(),
      name: model.text(),
      users: model.hasMany(() => user),
    })

    const toGql = toGraphQLSchema([tag, email, user, group])

    const expected = `
      type Tag {
        id: ID!
        value: String!
        created_at: DateTime!
        updated_at: DateTime!
        deleted_at: DateTime
      }

      type Email {
        email: String!
        isVerified: Boolean!
        created_at: DateTime!
        updated_at: DateTime!
        deleted_at: DateTime
      }

      extend type Email {
        owner: User!
      }

      enum UserRoleEnum {
        MODERATOR
        ADMIN
        GUEST
        NEW_USER
      }

      type User {
        id: ID!
        username: String!
        email: Email!
        spend_limit: String!
        phones: [String]!
        group: [Group]!
        role: UserRoleEnum!
        tags: [Tag]!
        raw_spend_limit: JSON!
        created_at: DateTime!
        updated_at: DateTime!
        deleted_at: DateTime
      }

      type Group {
        id: Int!
        name: String!
        users: [User]!
        created_at: DateTime!
        updated_at: DateTime!
        deleted_at: DateTime
      }
      `

    expect(toGql.replace(/\s/g, "")).toEqual(expected.replace(/\s/g, ""))
  })
})
