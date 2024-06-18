import { expectTypeOf } from "expect-type"
import { NumberProperty } from "../properties/number"

describe("Number property", () => {
  test("create number property type", () => {
    const property = new NumberProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<number>()
    expect(property.parse("age")).toEqual({
      fieldName: "age",
      dataType: {
        name: "number",
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
