import { expectTypeOf } from "expect-type"
import { HasMany } from "../relations/has_many"
import { StringSchema } from "../schema/string"

describe("HasMany relationship", () => {
  test("define hasMany relationship", () => {
    const user = {
      username: new StringSchema(),
    }

    const entityRef = () => user
    const relationship = new HasMany(entityRef, {})

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<() => typeof user>()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "hasMany",
      entity: entityRef,
      options: {},
    })
  })
})
