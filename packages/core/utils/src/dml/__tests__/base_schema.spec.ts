import { expectTypeOf } from "expect-type"
import { BaseSchema } from "../schema/base"
import { SchemaMetadata } from "../types"

describe("Base schema", () => {
  test("create a schema type from base schema", () => {
    class StringSchema extends BaseSchema<string> {
      protected dataType: SchemaMetadata["dataType"] = {
        name: "string",
      }
    }

    const schema = new StringSchema()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<string>()
    expect(schema.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "string",
      },
      nullable: false,
      optional: false,
      indexes: [],
      relationships: [],
    })
  })

  test("apply nullable modifier", () => {
    class StringSchema extends BaseSchema<string> {
      protected dataType: SchemaMetadata["dataType"] = {
        name: "string",
      }
    }

    const schema = new StringSchema().nullable()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<string | null>()
    expect(schema.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "string",
      },
      nullable: true,
      optional: false,
      indexes: [],
      relationships: [],
    })
  })

  test("apply optional modifier", () => {
    class StringSchema extends BaseSchema<string> {
      protected dataType: SchemaMetadata["dataType"] = {
        name: "string",
      }
    }

    const schema = new StringSchema().optional()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<string | undefined>()
    expect(schema.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "string",
      },
      nullable: false,
      optional: true,
      indexes: [],
      relationships: [],
    })
  })

  test("apply optional + nullable modifier", () => {
    class StringSchema extends BaseSchema<string> {
      protected dataType: SchemaMetadata["dataType"] = {
        name: "string",
      }
    }

    const schema = new StringSchema().optional().nullable()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<string | undefined | null>()
    expect(schema.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "string",
      },
      nullable: true,
      optional: true,
      indexes: [],
      relationships: [],
    })
  })

  test("define default value", () => {
    class StringSchema extends BaseSchema<string> {
      protected dataType: SchemaMetadata["dataType"] = {
        name: "string",
      }
    }

    const schema = new StringSchema().defaultsTo("foo")

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<string>()
    expect(schema.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "string",
      },
      defaultValue: "foo",
      nullable: false,
      optional: false,
      indexes: [],
      relationships: [],
    })
  })
})
