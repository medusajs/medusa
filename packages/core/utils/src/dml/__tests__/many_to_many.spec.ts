import { expectTypeOf } from "expect-type"
import { ManyToMany } from "../relations/many_to_many"
import { StringSchema } from "../schema/string"

describe("ManyToMany relationship", () => {
  test("define manyToMany relationship", () => {
    const user = {
      username: new StringSchema(),
    }

    const entityRef = () => user
    const relationship = new ManyToMany(entityRef, {})

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<() => typeof user>()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "manyToMany",
      entity: entityRef,
      options: {},
    })
  })
})
