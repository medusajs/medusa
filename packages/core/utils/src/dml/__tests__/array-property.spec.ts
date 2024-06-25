import { expectTypeOf } from "expect-type"
import { ArrayProperty } from "../properties/array"

describe("Array property", () => {
  test("should create an array property type", () => {
    const property = new ArrayProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<[]>()
    expect(property.parse("codes")).toEqual({
      fieldName: "codes",
      dataType: {
        name: "array",
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
