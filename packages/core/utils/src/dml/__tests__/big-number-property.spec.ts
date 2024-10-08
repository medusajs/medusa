import { expectTypeOf } from "expect-type"
import { BigNumberProperty } from "../properties/big-number"

describe("Big Number property", () => {
  test("create bigNumber property type", () => {
    const property = new BigNumberProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<number>()
    expect(property.parse("age")).toEqual({
      fieldName: "age",
      dataType: {
        name: "bigNumber",
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
