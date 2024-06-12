import { expectTypeOf } from "expect-type"
import { BaseSchema } from "../schema/base"
import { SchemaMetadata } from "../types"

describe("Base schema", () => {
  test("create a schema type from base schema", () => {
    class StringSchema extends BaseSchema<string> {
      protected dataType: SchemaMetadata["dataType"] = {
        name: "text",
      }
    }

    const schema = new StringSchema()

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

  test("apply nullable modifier", () => {
    class StringSchema extends BaseSchema<string> {
      protected dataType: SchemaMetadata["dataType"] = {
        name: "text",
      }
    }

    const schema = new StringSchema().nullable()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<string | null>()
    expect(schema.parse("username")).toEqual({
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
    class StringSchema extends BaseSchema<string> {
      protected dataType: SchemaMetadata["dataType"] = {
        name: "text",
      }
    }

    const schema = new StringSchema().defaultsTo("foo")

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<string>()
    expect(schema.parse("username")).toEqual({
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
