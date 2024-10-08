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

  test("should identify has many relationship", () => {
    const user = {
      username: new TextProperty(),
    }

    const entityRef = () => user
    let relationship = new HasMany(entityRef, {})

    expect(HasMany.isHasMany(relationship)).toEqual(true)

    relationship = {} as any

    expect(HasMany.isHasMany(relationship)).toEqual(false)
  })
})
