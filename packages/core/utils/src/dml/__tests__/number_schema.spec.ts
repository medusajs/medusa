import { expectTypeOf } from "expect-type"
import { NumberSchema } from "../schema/number"

describe("Number schema", () => {
  test("create number schema type", () => {
    const schema = new NumberSchema()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<number>()
    expect(schema.parse("age")).toEqual({
      fieldName: "age",
      dataType: {
        name: "number",
      },
      nullable: false,
      optional: false,
      indexes: [],
      relationships: [],
    })
  })
})
