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
        options: {
          primaryKey: false,
        },
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })

  test("create id property type with marking it as a primary key", () => {
    const property = new IdProperty().primaryKey()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("id")).toEqual({
      fieldName: "id",
      dataType: {
        name: "id",
        options: {
          primaryKey: true,
        },
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
