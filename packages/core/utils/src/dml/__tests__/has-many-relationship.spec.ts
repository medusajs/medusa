import { expectTypeOf } from "expect-type"
import { TextProperty } from "../properties/text"
import { HasMany } from "../relations/has-many"

describe("HasMany relationship", () => {
  test("define hasMany relationship", () => {
    const user = {
      username: new TextProperty(),
    }

    const entityRef = () => user
    const relationship = new HasMany(entityRef, {})

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<() => typeof user>()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "hasMany",
      nullable: false,
      options: {},
      entity: entityRef,
    })
  })
})
