import { expectTypeOf } from "expect-type"
import { TextProperty } from "../properties/text"

describe("Text property", () => {
  test("create text property type", () => {
    const property = new TextProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
        options: { primaryKey: false, searchable: false },
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })

  test("mark text property as primary key", () => {
    const property = new TextProperty().primaryKey()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
        options: { primaryKey: true, searchable: false },
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })

  test("mark text property as primary key with custom prefix", () => {
    const property = new TextProperty().primaryKey("idx_product_code")

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
        options: {
          primaryKey: true,
          searchable: false,
          prefix: "idx_product_code",
        },
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
