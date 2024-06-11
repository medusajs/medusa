import { expectTypeOf } from "expect-type"
import { EnumSchema } from "../schema/enum"

describe("Enum schema", () => {
  test("create enum schema type", () => {
    const schema = new EnumSchema(["admin", "moderator", "editor"])
    expectTypeOf(schema["$dataType"]).toEqualTypeOf<
      "admin" | "moderator" | "editor"
    >()

    expect(schema.parse("role")).toEqual({
      fieldName: "role",
      dataType: {
        name: "enum",
        options: {
          choices: ["admin", "moderator", "editor"],
        },
      },
      nullable: false,
      optional: false,
      indexes: [],
      relationships: [],
    })
  })

  test("apply nullable and optional modifiers", () => {
    const schema = new EnumSchema(["admin", "moderator", "editor"])
      .nullable()
      .optional()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<
      "admin" | "moderator" | "editor" | null | undefined
    >()

    expect(schema.parse("role")).toEqual({
      fieldName: "role",
      dataType: {
        name: "enum",
        options: {
          choices: ["admin", "moderator", "editor"],
        },
      },
      nullable: true,
      optional: true,
      indexes: [],
      relationships: [],
    })
  })
})
