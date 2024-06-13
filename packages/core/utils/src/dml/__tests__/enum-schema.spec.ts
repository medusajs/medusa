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
      indexes: [],
      relationships: [],
    })
  })

  test("apply nullable modifier", () => {
    const schema = new EnumSchema(["admin", "moderator", "editor"]).nullable()

    expectTypeOf(schema["$dataType"]).toEqualTypeOf<
      "admin" | "moderator" | "editor" | null
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
      indexes: [],
      relationships: [],
    })
  })
})
