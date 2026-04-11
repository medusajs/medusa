import { PropertyMetadata } from "@medusajs/types"
import { expectTypeOf } from "expect-type"
import { BaseProperty } from "../properties/base"
import { TextProperty } from "../properties/text"

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
      computed: false,
      indexes: [],
      relationships: [],
    })
  })

  test("apply searchable modifier", () => {
    const property = new TextProperty().searchable()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
        options: {
          searchable: true,
        },
      },
      defaultValue: undefined,
      nullable: false,
      computed: false,
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
      computed: false,
      indexes: [],
      relationships: [],
    })
  })

  test("apply computed property", () => {
    class StringProperty extends BaseProperty<string> {
      protected dataType: PropertyMetadata["dataType"] = {
        name: "text",
      }
    }

    const property = new StringProperty().computed()
    const property2 = new StringProperty().nullable().computed()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string | null>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
      },
      nullable: false,
      computed: true,
      indexes: [],
      relationships: [],
    })

    expectTypeOf(property2["$dataType"]).toEqualTypeOf<string | null>()
    expect(property2.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
      },
      nullable: true,
      computed: true,
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
      computed: false,
      indexes: [],
      relationships: [],
    })
  })
})
