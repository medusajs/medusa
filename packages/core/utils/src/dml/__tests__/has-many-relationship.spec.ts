import { expectTypeOf } from "expect-type"
import { TextSchema } from "../schema/text"
import { HasMany } from "../relations/has-many"

describe("HasMany relationship", () => {
  test("define hasMany relationship", () => {
    const user = {
      username: new TextSchema(),
    }

    const entityRef = () => user
    const relationship = new HasMany(entityRef, {})

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<() => typeof user>()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "hasMany",
      nullable: false,
      entity: entityRef,
    })
  })
})
