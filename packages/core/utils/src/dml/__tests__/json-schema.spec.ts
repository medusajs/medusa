import { expectTypeOf } from "expect-type"
import { JSONSchema } from "../schema/json"

describe("JSON schema", () => {
  test("create json schema type", () => {
    const schema = new JSONSchema()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<string>()
    expect(schema.parse("coordinates")).toEqual({
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
