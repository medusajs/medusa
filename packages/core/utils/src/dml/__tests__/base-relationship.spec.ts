import { expectTypeOf } from "expect-type"
import { TextProperty } from "../properties/text"
import { BaseRelationship } from "../relations/base"

describe("Base relationship", () => {
  test("define a custom relationship", () => {
    class HasOne<T> extends BaseRelationship<T> {
      type: "hasOne" = "hasOne"
    }

    const user = {
      username: new TextProperty(),
    }

    const entityRef = () => user
    const relationship = new HasOne(entityRef, {
      mappedBy: "user_id",
    })

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<() => typeof user>()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "hasOne",
      nullable: false,
      options: { mappedBy: "user_id" },
      mappedBy: "user_id",
      entity: entityRef,
    })
  })
})
