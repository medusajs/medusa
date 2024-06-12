import { expectTypeOf } from "expect-type"
import { TextSchema } from "../schema/text"
import { ManyToMany } from "../relations/many_to_many"

describe("ManyToMany relationship", () => {
  test("define manyToMany relationship", () => {
    const user = {
      username: new TextSchema(),
    }

    const entityRef = () => user
    const relationship = new ManyToMany(entityRef, {})

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<() => typeof user>()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "manyToMany",
      nullable: false,
      optional: false,
      entity: entityRef,
      options: {},
    })
  })
})
