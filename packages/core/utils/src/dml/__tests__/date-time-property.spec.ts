import { expectTypeOf } from "expect-type"
import { DateTimeProperty } from "../properties/date-time"

describe("DateTime property", () => {
  test("create datetime property type", () => {
    const property = new DateTimeProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<Date>()
    expect(property.parse("created_at")).toEqual({
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
