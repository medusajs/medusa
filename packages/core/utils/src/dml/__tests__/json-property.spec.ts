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
      computed: false,
      indexes: [],
      relationships: [],
    })
  })

  test("create json property with a custom data-type", () => {
    type Warning = { code: string; message: string }
    const property = new JSONProperty<Warning[]>()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<Warning[]>()
    expect(property.parse("warnings")).toEqual({
      fieldName: "warnings",
      dataType: {
        name: "json",
      },
      nullable: false,
      computed: false,
      indexes: [],
      relationships: [],
    })
  })

  test("create json property with an array default value", () => {
    type Warning = { code: string; message: string }
    const property = new JSONProperty<Warning[]>().default([
      { code: "unknown", message: "Something went wrong" },
    ])

    expectTypeOf(property["$dataType"]).toEqualTypeOf<Warning[]>()
    expect(property.parse("warnings")).toEqual({
      fieldName: "warnings",
      dataType: {
        name: "json",
      },
      defaultValue: [{ code: "unknown", message: "Something went wrong" }],
      nullable: false,
      computed: false,
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
      computed: false,
      indexes: [],
      relationships: [],
    })
  })
})
