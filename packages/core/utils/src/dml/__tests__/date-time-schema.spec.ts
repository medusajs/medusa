import { expectTypeOf } from "expect-type"
import { DateTimeSchema } from "../schema/date-time"

describe("DateTime schema", () => {
  test("create datetime schema type", () => {
    const schema = new DateTimeSchema()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<Date>()
    expect(schema.parse("created_at")).toEqual({
      fieldName: "created_at",
      dataType: {
        name: "dateTime",
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
