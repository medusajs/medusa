import { expectTypeOf } from "expect-type"
import { TextProperty } from "../properties/text"
import { HasOne } from "../relations/has-one"

describe("HasOne relationship", () => {
  test("define hasOne relationship", () => {
    const user = {
      username: new TextProperty(),
    }

    const entityRef = () => user
    const relationship = new HasOne(entityRef, {})

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<() => typeof user>()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "hasOne",
      nullable: false,
      options: {},
      entity: entityRef,
    })
  })

  test("mark relationship as nullable", () => {
    const user = {
      username: new TextProperty(),
    }

    const entityRef = () => user
    const relationship = new HasOne(entityRef, {}).nullable()

    expectTypeOf(relationship["$dataType"]).toEqualTypeOf<
      (() => typeof user) | null
    >()
    expect(relationship.parse("user")).toEqual({
      name: "user",
      type: "hasOne",
      nullable: true,
      options: {},
      entity: entityRef,
    })
  })
})
