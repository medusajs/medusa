import { expectTypeOf } from "expect-type"
import { IdProperty } from "../properties/id"

describe("Id property", () => {
  test("create id property type", () => {
    const property = new IdProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("id")).toEqual({
      fieldName: "id",
      dataType: {
        name: "id",
        options: {},
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
