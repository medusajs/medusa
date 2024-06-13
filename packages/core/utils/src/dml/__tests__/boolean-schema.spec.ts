import { expectTypeOf } from "expect-type"
import { BooleanSchema } from "../schema/boolean"

describe("Boolean schema", () => {
  test("create boolean schema type", () => {
    const schema = new BooleanSchema()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<boolean>()
    expect(schema.parse("isAdmin")).toEqual({
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
