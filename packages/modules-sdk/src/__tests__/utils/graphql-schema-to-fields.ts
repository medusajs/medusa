import { mergeTypeDefs } from "@graphql-tools/merge"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { graphqlSchemaToFields } from "../../utils"

const userModule = `
type User {
  id: ID!
  name: String!
  blabla: WHATEVER
}

type Post {
  author: User!
}
`

const postModule = `
type Post {
  id: ID!
  title: String!
  date: String
}

type User {
  posts: [Post!]!
}

type WHATEVER {
  random_field: String
  post: Post
}
`

const mergedSchema = mergeTypeDefs([userModule, postModule])
const schema = makeExecutableSchema({
  typeDefs: mergedSchema,
})

const types = schema.getTypeMap()

describe("graphqlSchemaToFields", function () {
  it("Should get all fields of a given entity", async function () {
    const fields = graphqlSchemaToFields(types, "User")
    expect(fields).toEqual(expect.arrayContaining(["id", "name"]))
  })

  it("Should get all fields of a given entity and a relation", async function () {
    const fields = graphqlSchemaToFields(types, "User", ["posts"])
    expect(fields).toEqual(
      expect.arrayContaining([
        "id",
        "name",
        "posts.id",
        "posts.title",
        "posts.date",
      ])
    )
  })

  it("Should get all fields of a given entity and many relations", async function () {
    const fields = graphqlSchemaToFields(types, "User", [
      "posts",
      "blabla",
      "blabla.post",
    ])
    expect(fields).toEqual(
      expect.arrayContaining([
        "id",
        "name",
        "posts.id",
        "posts.title",
        "posts.date",
        "blabla.random_field",
        "blabla.post.id",
        "blabla.post.title",
        "blabla.post.date",
      ])
    )
  })

  it("Should get all fields of a given entity and many relations limited to the relations given", async function () {
    const fields = graphqlSchemaToFields(types, "User", ["posts", "blabla"])
    expect(fields).toEqual(
      expect.arrayContaining([
        "id",
        "name",
        "posts.id",
        "posts.title",
        "posts.date",
        "blabla.random_field",
      ])
    )
  })

  it("Should get all fields of a given entity and many relations limited to the relations given if they exists", async function () {
    const fields = graphqlSchemaToFields(types, "User", [
      "posts",
      "doNotExists",
    ])
    expect(fields).toEqual(
      expect.arrayContaining([
        "id",
        "name",
        "posts.id",
        "posts.title",
        "posts.date",
      ])
    )
  })
})
