import { expectTypeOf } from "expect-type"
import { TextSchema } from "../schema/text"

describe("String schema", () => {
  test("create string schema type", () => {
    const schema = new TextSchema()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<string>()
    expect(schema.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
