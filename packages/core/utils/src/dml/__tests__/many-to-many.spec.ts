import { expectTypeOf } from "expect-type"
import { TextProperty } from "../properties/text"
import { ManyToMany } from "../relations/many-to-many"

describe("ManyToMany relationship", () => {
  test("define manyToMany relationship", () => {
    const user = {
      username: new TextProperty(),
    }

    const entityRef = () => user
    const relationship = new ManyToMany(entityRef, {})

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<() => typeof user>()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "manyToMany",
      nullable: false,
      options: {},
      entity: entityRef,
    })
  })

  test("should identify many to many relationship", () => {
    const user = {
      username: new TextProperty(),
    }

    const entityRef = () => user
    let relationship = new ManyToMany(entityRef, {})

    expect(ManyToMany.isManyToMany(relationship)).toEqual(true)

    relationship = {} as any

    expect(ManyToMany.isManyToMany(relationship)).toEqual(false)
  })
})
