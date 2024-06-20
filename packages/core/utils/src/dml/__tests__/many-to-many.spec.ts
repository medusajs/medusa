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
})
