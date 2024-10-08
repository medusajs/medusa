import { expectTypeOf } from "expect-type"
import { BooleanProperty } from "../properties/boolean"

describe("Boolean property", () => {
  test("create boolean property type", () => {
    const property = new BooleanProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<boolean>()
    expect(property.parse("isAdmin")).toEqual({
      fieldName: "isAdmin",
      dataType: {
        name: "boolean",
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
