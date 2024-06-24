import { expectTypeOf } from "expect-type"
import { BaseProperty } from "../properties/base"
import { PropertyMetadata } from "@medusajs/types"

describe("Base property", () => {
  test("create a property type from base property", () => {
    class StringProperty extends BaseProperty<string> {
      protected dataType: PropertyMetadata["dataType"] = {
        name: "text",
      }
    }

    const property = new StringProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })

  test("apply nullable modifier", () => {
    class StringProperty extends BaseProperty<string> {
      protected dataType: PropertyMetadata["dataType"] = {
        name: "text",
      }
    }

    const property = new StringProperty().nullable()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string | null>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
      },
      nullable: true,
      indexes: [],
      relationships: [],
    })
  })

  test("define default value", () => {
    class StringProperty extends BaseProperty<string> {
      protected dataType: PropertyMetadata["dataType"] = {
        name: "text",
      }
    }

    const property = new StringProperty().default("foo")

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
      },
      defaultValue: "foo",
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
