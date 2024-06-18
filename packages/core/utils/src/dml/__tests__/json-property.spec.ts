import { expectTypeOf } from "expect-type"
import { JSONProperty } from "../properties/json"

describe("JSON property", () => {
  test("create json property type", () => {
    const property = new JSONProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("coordinates")).toEqual({
      fieldName: "coordinates",
      dataType: {
        name: "json",
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
