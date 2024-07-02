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

  test("use typescript enum as enum property options", () => {
    enum Roles {
      ADMIN,
      WRITER,
      EDITOR,
    }

    const property = new EnumProperty(Roles)
    expectTypeOf(property["$dataType"]).toEqualTypeOf<Roles>()

    expect(property.parse("role")).toEqual({
      fieldName: "role",
      dataType: {
        name: "enum",
        options: {
          choices: ["ADMIN", "WRITER", "EDITOR", 0, 1, 2],
        },
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })

  test("use typescript enum with key-value pair as enum property options", () => {
    enum Roles {
      ADMIN = "admin",
      WRITER = "writer",
      EDITOR = "editor",
    }

    const property = new EnumProperty(Roles)
    expectTypeOf(property["$dataType"]).toEqualTypeOf<Roles>()

    expect(property.parse("role")).toEqual({
      fieldName: "role",
      dataType: {
        name: "enum",
        options: {
          choices: ["admin", "writer", "editor"],
        },
      },
      nullable: false,
      indexes: [],
      relationships: [],
    })
  })
})
