import { expectTypeOf } from "expect-type"
import { EnumProperty } from "../properties/enum"

describe("Enum property", () => {
  test("create enum property type", () => {
    const property = new EnumProperty(["admin", "moderator", "editor"])
    expectTypeOf(property["$dataType"]).toEqualTypeOf<
      "admin" | "moderator" | "editor"
    >()

    expect(property.parse("role")).toEqual({
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
    const property = new EnumProperty([
      "admin",
      "moderator",
      "editor",
    ]).nullable()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<
      "admin" | "moderator" | "editor" | null
    >()

    expect(property.parse("role")).toEqual({
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
