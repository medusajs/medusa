import { expectTypeOf } from "expect-type"
import { JSONProperty } from "../properties/json"

describe("JSON property", () => {
  test("create json property type", () => {
    const property = new JSONProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<Record<string, unknown>>()
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

  test("create json property with default value", () => {
    const property = new JSONProperty().default({ a: 1 })

    expectTypeOf(property["$dataType"]).toEqualTypeOf<Record<string, unknown>>()
    expect(property.parse("coordinates")).toEqual({
      fieldName: "coordinates",
      dataType: {
        name: "json",
      },
      defaultValue: {
        a: 1,
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
