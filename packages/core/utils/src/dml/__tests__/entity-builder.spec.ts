import { EntityConstructor } from "@medusajs/types"
import { MetadataStorage } from "@mikro-orm/core"
import { expectTypeOf } from "expect-type"
import { DmlEntity } from "../entity"
import { model } from "../entity-builder"
import {
  createMikrORMEntity,
  toMikroOrmEntities,
  toMikroORMEntity,
} from "../helpers/create-mikro-orm-entity"

describe("Entity builder", () => {
  beforeEach(() => {
    MetadataStorage.clear()
  })

  describe("Entity builder | properties", () => {
    test("should identify a DML entity correctly", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
      })

      expect(DmlEntity.isDmlEntity(user)).toBe(true)

      const nonDmlEntity = new Object()

      expect(DmlEntity.isDmlEntity(nonDmlEntity)).toBe(false)
    })

    test("define an entity", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
        spend_limit: model.bigNumber(),
      })

      expect(user.name).toEqual("user")
      expect(user.parse().tableName).toEqual("user")

      const User = toMikroORMEntity(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        spend_limit: number
        raw_spend_limit: Record<string, unknown>
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        spend_limit: {
          columnType: "numeric",
          getter: true,
          name: "spend_limit",
          nullable: false,
          reference: "scalar",
          setter: true,
          trackChanges: false,
          type: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          nullable: false,
          reference: "scalar",
          setter: false,
          type: "any",
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define an entity with a table name and a name", () => {
      const user = model.define(
        { name: "user", tableName: "user_table" },
        {
          id: model.number(),
          username: model.text(),
          email: model.text(),
          spend_limit: model.bigNumber(),
        }
      )

      expect(user.name).toEqual("user")
      expect(user.parse().tableName).toEqual("user_table")

      const User = toMikroORMEntity(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        spend_limit: number
        raw_spend_limit: Record<string, unknown>
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        spend_limit: {
          columnType: "numeric",
          getter: true,
          name: "spend_limit",
          nullable: false,
          reference: "scalar",
          setter: true,
          trackChanges: false,
          type: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          nullable: false,
          reference: "scalar",
          setter: false,
          type: "any",
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define an entity with a table name only", () => {
      const user = model.define(
        { tableName: "user_role" },
        {
          id: model.number(),
          username: model.text(),
          email: model.text(),
          spend_limit: model.bigNumber(),
        }
      )

      expect(user.name).toEqual("userRole")
      expect(user.parse().tableName).toEqual("user_role")

      const User = toMikroORMEntity(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        spend_limit: number
        raw_spend_limit: Record<string, unknown>
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("UserRole")
      expect(metaData.path).toEqual("UserRole")

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        spend_limit: {
          columnType: "numeric",
          getter: true,
          name: "spend_limit",
          nullable: false,
          reference: "scalar",
          setter: true,
          trackChanges: false,
          type: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          nullable: false,
          reference: "scalar",
          setter: false,
          type: "any",
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define a property with default value", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text().default("foo"),
        email: model.text(),
        spend_limit: model.bigNumber().default(500.4),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          default: "foo",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        spend_limit: {
          columnType: "numeric",
          default: 500.4,
          getter: true,
          name: "spend_limit",
          nullable: false,
          reference: "scalar",
          setter: true,
          trackChanges: false,
          type: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          nullable: false,
          reference: "scalar",
          setter: false,
          type: "any",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("should mark a property as searchable", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text().searchable(),
        email: model.text(),
        spend_limit: model.bigNumber().default(500.4),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
          searchable: true,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        spend_limit: {
          columnType: "numeric",
          default: 500.4,
          getter: true,
          name: "spend_limit",
          nullable: false,
          reference: "scalar",
          setter: true,
          trackChanges: false,
          type: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          nullable: false,
          reference: "scalar",
          setter: false,
          type: "any",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("mark property nullable", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text().nullable(),
        email: model.text(),
        spend_limit: model.bigNumber().nullable(),
      })

      const User = toMikroORMEntity(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string | null
        email: string
        spend_limit: number | null
        raw_spend_limit: Record<string, unknown> | null
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)

      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      const userInstance = new User()

      expect(userInstance.username).toEqual(null)

      expect(userInstance.spend_limit).toEqual(undefined)
      expect(userInstance.raw_spend_limit).toEqual(null)

      userInstance.username = "john"
      expect(userInstance.username).toEqual("john")

      userInstance.spend_limit = 150.5
      expect(userInstance.spend_limit).toEqual(150.5)
      expect(userInstance.raw_spend_limit).toEqual({
        precision: 20,
        value: "150.5",
      })

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: true,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          nullable: true,
          reference: "scalar",
          setter: false,
          type: "any",
        },
        spend_limit: {
          columnType: "numeric",
          getter: true,
          name: "spend_limit",
          nullable: true,
          reference: "scalar",
          setter: true,
          trackChanges: false,
          type: "any",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define an entity with enum property", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
        role: model.enum(["moderator", "admin", "guest"]),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        role: "moderator" | "admin" | "guest"
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)

      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        role: {
          reference: "scalar",
          enum: true,
          items: expect.any(Function),
          nullable: false,
          name: "role",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      expect(metaData.properties["role"].items()).toEqual([
        "moderator",
        "admin",
        "guest",
      ])
    })

    test("define enum property with default value", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
        role: model.enum(["moderator", "admin", "guest"]).default("guest"),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        role: "moderator" | "admin" | "guest"
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)

      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        role: {
          reference: "scalar",
          enum: true,
          default: "guest",
          items: expect.any(Function),
          nullable: false,
          name: "role",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
      expect(metaData.properties["role"].items()).toEqual([
        "moderator",
        "admin",
        "guest",
      ])
    })

    test("mark enum property nullable", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
        role: model.enum(["moderator", "admin", "guest"]).nullable(),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        role: "moderator" | "admin" | "guest" | null
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)

      const userInstance = new User()
      expect(userInstance.role).toEqual(null)

      userInstance.role = "admin"
      expect(userInstance.role).toEqual("admin")

      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        role: {
          reference: "scalar",
          enum: true,
          items: expect.any(Function),
          nullable: true,
          name: "role",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
      expect(metaData.properties["role"].items()).toEqual([
        "moderator",
        "admin",
        "guest",
      ])
    })

    test("disallow defining created_at and updated_at timestamps", () => {
      expect(() =>
        model.define("user", {
          id: model.number(),
          username: model.text(),
          email: model.text(),
          created_at: model.dateTime(),
          updated_at: model.dateTime(),
        })
      ).toThrow(
        'Cannot define field(s) "created_at,updated_at" as they are implicitly defined on every model'
      )
    })

    test("disallow defining deleted_at timestamp", () => {
      expect(() =>
        model.define("user", {
          id: model.number(),
          username: model.text(),
          email: model.text(),
          deleted_at: model.dateTime(),
        })
      ).toThrow(
        'Cannot define field(s) "deleted_at" as they are implicitly defined on every model'
      )
    })

    test("define pg schema name in the entity name", () => {
      const user = model.define("public.user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.tableName).toEqual("public.user")

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })
  })

  describe("Entity builder | id", () => {
    test("define an entity with id property", () => {
      const user = model.define("user", {
        id: model.id(),
        username: model.text(),
        email: model.text(),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: string
        username: string
        email: string
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.hooks).toEqual({
        beforeCreate: ["generateId"],
        onInit: ["generateId"],
      })

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "id",
          nullable: false,
          primary: true,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("mark id as non-primary", () => {
      const user = model.define("user", {
        id: model.id({ primaryKey: false }),
        username: model.text(),
        email: model.text(),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: string
        username: string
        email: string
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      const userInstance = new User()
      userInstance["generateId"]()

      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.hooks).toEqual({
        beforeCreate: ["generateId"],
        onInit: ["generateId"],
      })

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      expect(userInstance.id).toBeDefined()
    })

    test("define prefix for the id", () => {
      const user = model.define("user", {
        id: model.id({ primaryKey: false, prefix: "us" }),
        username: model.text(),
        email: model.text(),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: string
        username: string
        email: string
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      const userInstance = new User()
      userInstance["generateId"]()

      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.hooks).toEqual({
        beforeCreate: ["generateId"],
        onInit: ["generateId"],
      })

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      expect(userInstance.id.startsWith("us_")).toBeTruthy()
    })
  })

  describe("Entity builder | primaryKey", () => {
    test("should create both id fields and primaryKey fields", () => {
      const user = model.define("user", {
        id: model.id({ primaryKey: false }),
        email: model.text().primaryKey(),
        account_id: model.number().primaryKey(),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: string
        email: string
        account_id: number
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      const userInstance = new User()
      userInstance["generateId"]()

      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.hooks).toEqual({
        beforeCreate: ["generateId"],
        onInit: ["generateId"],
      })

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          columnType: "text",
          name: "email",
          nullable: false,
          primary: true,
          reference: "scalar",
          type: "string",
        },
        account_id: {
          columnType: "integer",
          name: "account_id",
          nullable: false,
          primary: true,
          reference: "scalar",
          type: "number",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      expect(userInstance.id).toBeDefined()
    })

    test("should infer primaryKeys from a model", () => {
      let user = model.define("user", {
        id: model.id(),
        email: model.text(),
        account_id: model.number(),
      })

      const entityBuilder = createMikrORMEntity()
      let User = entityBuilder(user)
      let metaData = MetadataStorage.getMetadataFromDecorator(User)

      expect(metaData.properties.id).toEqual({
        columnType: "text",
        name: "id",
        nullable: false,
        primary: true,
        reference: "scalar",
        type: "string",
      })

      user = model.define("user", {
        id: model.id(),
        email: model.text().primaryKey(),
        account_id: model.number(),
      })

      User = entityBuilder(user)
      metaData = MetadataStorage.getMetadataFromDecorator(User)

      expect(metaData.properties.id).toEqual({
        columnType: "text",
        name: "id",
        nullable: false,
        reference: "scalar",
        type: "string",
        getter: false,
        setter: false,
      })

      expect(metaData.properties.email).toEqual({
        columnType: "text",
        name: "email",
        nullable: false,
        reference: "scalar",
        type: "string",
        primary: true,
      })

      expect(metaData.properties.account_id).toEqual({
        columnType: "integer",
        name: "account_id",
        nullable: false,
        reference: "scalar",
        type: "number",
        getter: false,
        setter: false,
      })

      user = model.define("user", {
        id: model.id(),
        email: model.text().primaryKey(),
        account_id: model.number().primaryKey(),
      })

      User = entityBuilder(user)
      metaData = MetadataStorage.getMetadataFromDecorator(User)

      expect(metaData.properties.id).toEqual({
        columnType: "text",
        name: "id",
        nullable: false,
        reference: "scalar",
        type: "string",
        getter: false,
        setter: false,
      })

      expect(metaData.properties.email).toEqual({
        columnType: "text",
        name: "email",
        nullable: false,
        reference: "scalar",
        type: "string",
        primary: true,
      })

      expect(metaData.properties.account_id).toEqual({
        columnType: "integer",
        name: "account_id",
        nullable: false,
        reference: "scalar",
        type: "number",
        primary: true,
      })
    })
  })

  describe("Entity builder | indexes", () => {
    test("define index on a field", () => {
      const user = model.define("user", {
        id: model.number().index(),
        username: model.text(),
        email: model.text().unique(),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.indexes).toEqual([
        {
          name: "IDX_user_id",
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_id" ON "user" (id) WHERE deleted_at IS NULL',
        },
        {
          name: "IDX_user_email_unique",
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_unique" ON "user" (email) WHERE deleted_at IS NULL',
        },
      ])

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define index when entity is using an explicit pg Schema", () => {
      const user = model.define("platform.user", {
        id: model.number().index(),
        username: model.text(),
        email: model.text().unique(),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.tableName).toEqual("platform.user")

      expect(metaData.indexes).toEqual([
        {
          name: "IDX_user_id",
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_id" ON "platform"."user" (id) WHERE deleted_at IS NULL',
        },
        {
          name: "IDX_user_email_unique",
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_unique" ON "platform"."user" (email) WHERE deleted_at IS NULL',
        },
      ])

      expect(metaData.filters).toEqual({
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })
  })

  describe("Entity builder | hasOne", () => {
    test("define hasOne relationship", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        deleted_at: Date | null
        email: EntityConstructor<{
          email: string
          isVerified: boolean
          deleted_at: Date | null
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "1:1",
          name: "email",
          entity: "Email",
          nullable: false,
          mappedBy: "user",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("mark hasOne relationship as nullable", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        emails: model.hasOne(() => email).nullable(),
      })

      const User = toMikroORMEntity(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        deleted_at: Date | null
        emails: EntityConstructor<{
          email: string
          isVerified: boolean
          deleted_at: Date | null
        }> | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          reference: "1:1",
          name: "emails",
          entity: "Email",
          nullable: true,
          mappedBy: "user",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define custom mappedBy key for relationship", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email, { mappedBy: "owner" }),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: EntityConstructor<{ email: string; isVerified: boolean }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "1:1",
          name: "email",
          entity: "Email",
          nullable: false,
          mappedBy: "owner",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define delete cascades for the entity", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model
        .define("user", {
          id: model.number(),
          username: model.text(),
          email: model.hasOne(() => email),
        })
        .cascades({
          delete: ["email"],
        })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: EntityConstructor<{ email: string; isVerified: boolean }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "1:1",
          name: "email",
          entity: "Email",
          nullable: false,
          mappedBy: "user",
          cascade: ["perist", "soft-remove"],
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const Email = toMikroORMEntity(email)
      const emailMetaData = MetadataStorage.getMetadataFromDecorator(Email)
      expect(emailMetaData.className).toEqual("Email")
      expect(emailMetaData.path).toEqual("Email")
      expect(emailMetaData.properties).toEqual({
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          reference: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define delete cascades with belongsTo on the other end", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user),
      })

      const user = model
        .define("user", {
          id: model.number(),
          username: model.text(),
          email: model.hasOne(() => email),
        })
        .cascades({
          delete: ["email"],
        })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: EntityConstructor<{
          email: string
          isVerified: boolean
          user: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "1:1",
          name: "email",
          entity: "Email",
          nullable: false,
          mappedBy: "user",
          cascade: ["perist", "soft-remove"],
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const Email = toMikroORMEntity(email)
      const emailMetaData = MetadataStorage.getMetadataFromDecorator(Email)
      expect(emailMetaData.className).toEqual("Email")
      expect(emailMetaData.path).toEqual("Email")
      expect(emailMetaData.properties).toEqual({
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          reference: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          entity: "User",
          mappedBy: "email",
          name: "user",
          nullable: false,
          onDelete: "cascade",
          owner: true,
          reference: "1:1",
        },
        user_id: {
          columnType: "text",
          getter: false,
          name: "user_id",
          nullable: false,
          reference: "scalar",
          setter: false,
          type: "string",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })
  })

  describe("Entity builder | hasMany", () => {
    test("define hasMany relationship", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        emails: model.hasMany(() => email),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        emails: EntityConstructor<{ email: string; isVerified: boolean }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          reference: "1:m",
          name: "emails",
          entity: "Email",
          orphanRemoval: true,
          mappedBy: "user",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define custom mappedBy property name for hasMany relationship", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        emails: model.hasMany(() => email, {
          mappedBy: "the_user",
        }),
      })

      const User = toMikroORMEntity(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        emails: EntityConstructor<{ email: string; isVerified: boolean }> | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          reference: "1:m",
          name: "emails",
          entity: "Email",
          mappedBy: "the_user",
          orphanRemoval: true,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define delete cascades for the entity", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model
        .define("user", {
          id: model.number(),
          username: model.text(),
          emails: model.hasMany(() => email),
        })
        .cascades({
          delete: ["emails"],
        })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        emails: EntityConstructor<{ email: string; isVerified: boolean }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          reference: "1:m",
          name: "emails",
          entity: "Email",
          orphanRemoval: true,
          mappedBy: "user",
          cascade: ["perist", "soft-remove"],
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define delete cascades with belongsTo on the other end", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user, { mappedBy: "emails" }),
      })

      const user = model
        .define("user", {
          id: model.number(),
          username: model.text(),
          emails: model.hasMany(() => email),
        })
        .cascades({
          delete: ["emails"],
        })

      const User = toMikroORMEntity(user)
      const Email = toMikroORMEntity(email)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        emails: EntityConstructor<{ email: string; isVerified: boolean }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          reference: "1:m",
          name: "emails",
          entity: "Email",
          orphanRemoval: true,
          mappedBy: "user",
          cascade: ["perist", "soft-remove"],
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const emailMetaData = MetadataStorage.getMetadataFromDecorator(Email)
      expect(emailMetaData.className).toEqual("Email")
      expect(emailMetaData.path).toEqual("Email")
      expect(emailMetaData.properties).toEqual({
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          reference: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          entity: "User",
          name: "user",
          nullable: false,
          persist: false,
          reference: "m:1",
        },
        user_id: {
          columnType: "text",
          entity: "User",
          fieldName: "user_id",
          mapToPk: true,
          name: "user_id",
          nullable: false,
          onDelete: "cascade",
          reference: "m:1",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })
  })

  describe("Entity builder | belongsTo", () => {
    test("define belongsTo relationship with hasOne", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email),
      })

      const [User, Email] = toMikroOrmEntities([user, email])

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        deleted_at: Date | null
        email: EntityConstructor<{
          email: string
          isVerified: boolean
          deleted_at: Date | null
          user: EntityConstructor<{
            id: number
            username: string
            deleted_at: Date | null
          }>
        }>
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        deleted_at: Date | null
        user: EntityConstructor<{
          id: number
          username: string
          deleted_at: Date | null
          email: EntityConstructor<{
            email: string
            isVerified: boolean
            deleted_at: Date | null
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "1:1",
          name: "email",
          entity: "Email",
          nullable: false,
          mappedBy: "user",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const emailMetaData = MetadataStorage.getMetadataFromDecorator(Email)
      expect(emailMetaData.className).toEqual("Email")
      expect(emailMetaData.path).toEqual("Email")
      expect(emailMetaData.properties).toEqual({
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          reference: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          reference: "1:1",
          entity: "User",
          nullable: false,
          mappedBy: "email",
          owner: true,
        },
        user_id: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          nullable: false,
          name: "user_id",
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("mark belongsTo with hasOne as nullable", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user).nullable(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email),
      })

      const User = toMikroORMEntity(user)
      const Email = toMikroORMEntity(email)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: EntityConstructor<{
          email: string
          isVerified: boolean
          user: EntityConstructor<{
            id: number
            username: string
          }> | null
        }>
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        user: EntityConstructor<{
          id: number
          username: string
          email: EntityConstructor<{
            email: string
            isVerified: boolean
          }>
        }> | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "1:1",
          name: "email",
          entity: "Email",
          nullable: false,
          mappedBy: "user",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const emailMetaData = MetadataStorage.getMetadataFromDecorator(Email)
      expect(emailMetaData.className).toEqual("Email")
      expect(emailMetaData.path).toEqual("Email")
      expect(emailMetaData.properties).toEqual({
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          reference: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          reference: "1:1",
          entity: "User",
          nullable: true,
          mappedBy: "email",
          owner: true,
        },
        user_id: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          nullable: true,
          name: "user_id",
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define belongsTo relationship with hasMany", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user, { mappedBy: "emails" }),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        emails: model.hasMany(() => email),
      })

      const User = toMikroORMEntity(user)
      const Email = toMikroORMEntity(email)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        emails: EntityConstructor<{
          email: string
          isVerified: boolean
          user: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        user: EntityConstructor<{
          id: number
          username: string
          emails: EntityConstructor<{
            email: string
            isVerified: boolean
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          reference: "1:m",
          name: "emails",
          entity: "Email",
          mappedBy: "user",
          orphanRemoval: true,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const emailMetaData = MetadataStorage.getMetadataFromDecorator(Email)
      expect(emailMetaData.className).toEqual("Email")
      expect(emailMetaData.path).toEqual("Email")
      expect(emailMetaData.properties).toEqual({
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          reference: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          reference: "m:1",
          entity: "User",
          persist: false,
          nullable: false,
        },
        user_id: {
          name: "user_id",
          reference: "m:1",
          entity: "User",
          columnType: "text",
          mapToPk: true,
          fieldName: "user_id",
          nullable: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define belongsTo with hasMany as nullable", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user, { mappedBy: "emails" }).nullable(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        emails: model.hasMany(() => email),
      })

      const User = toMikroORMEntity(user)
      const Email = toMikroORMEntity(email)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        emails: EntityConstructor<{
          email: string
          isVerified: boolean
          user: EntityConstructor<{
            id: number
            username: string
          }> | null
        }>
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        user: EntityConstructor<{
          id: number
          username: string
          emails: EntityConstructor<{
            email: string
            isVerified: boolean
          }>
        }> | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          reference: "1:m",
          name: "emails",
          entity: "Email",
          mappedBy: "user",
          orphanRemoval: true,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const emailMetaData = MetadataStorage.getMetadataFromDecorator(Email)
      expect(emailMetaData.className).toEqual("Email")
      expect(emailMetaData.path).toEqual("Email")
      expect(emailMetaData.properties).toEqual({
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          reference: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          reference: "m:1",
          entity: "User",
          persist: false,
          nullable: true,
        },
        user_id: {
          name: "user_id",
          reference: "m:1",
          entity: "User",
          columnType: "text",
          mapToPk: true,
          fieldName: "user_id",
          nullable: true,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("throw error when other side relationship is missing", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
      })

      expect(() => toMikroORMEntity(email)).toThrow(
        'Missing property "email" on "User" entity. Make sure to define it as a relationship'
      )
    })

    test("throw error when other side relationship is invalid", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.belongsTo(() => email),
      })

      expect(() => toMikroORMEntity(email)).toThrow(
        'Invalid relationship reference for "email" on "User" entity. Make sure to define a hasOne or hasMany relationship'
      )
    })

    test("throw error when cascading a parent from a child", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
      })

      const defineEmail = () =>
        model
          .define("email", {
            email: model.text(),
            isVerified: model.boolean(),
            user: model.belongsTo(() => user),
          })
          .cascades({
            // @ts-expect-error "User cannot be mentioned in cascades"
            delete: ["user"],
          })

      expect(defineEmail).toThrow(
        'Cannot cascade delete "user" relationship(s) from "email" entity. Child to parent cascades are not allowed'
      )
    })

    test("define relationships when entity names has pg schema name", () => {
      const email = model.define("platform.email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user),
      })

      const user = model.define("platform.user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email),
      })

      const User = toMikroORMEntity(user)
      const Email = toMikroORMEntity(email)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        deleted_at: Date | null
        email: EntityConstructor<{
          email: string
          isVerified: boolean
          deleted_at: Date | null
          user: EntityConstructor<{
            id: number
            username: string
            deleted_at: Date | null
          }>
        }>
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        deleted_at: Date | null
        user: EntityConstructor<{
          id: number
          username: string
          deleted_at: Date | null
          email: EntityConstructor<{
            email: string
            isVerified: boolean
            deleted_at: Date | null
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.tableName).toEqual("platform.user")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "1:1",
          name: "email",
          entity: "Email",
          nullable: false,
          mappedBy: "user",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const emailMetaData = MetadataStorage.getMetadataFromDecorator(Email)
      expect(emailMetaData.className).toEqual("Email")
      expect(emailMetaData.path).toEqual("Email")
      expect(emailMetaData.tableName).toEqual("platform.email")
      expect(emailMetaData.properties).toEqual({
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          reference: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          reference: "1:1",
          entity: "User",
          nullable: false,
          mappedBy: "email",
          owner: true,
        },
        user_id: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          nullable: false,
          name: "user_id",
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define relationships between cross pg schemas entities", () => {
      const email = model.define("platform.email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user),
      })

      const user = model.define("public.user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email),
      })

      const User = toMikroORMEntity(user)
      const Email = toMikroORMEntity(email)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        deleted_at: Date | null
        email: EntityConstructor<{
          email: string
          isVerified: boolean
          deleted_at: Date | null
          user: EntityConstructor<{
            id: number
            username: string
            deleted_at: Date | null
          }>
        }>
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        deleted_at: Date | null
        user: EntityConstructor<{
          id: number
          username: string
          deleted_at: Date | null
          email: EntityConstructor<{
            email: string
            isVerified: boolean
            deleted_at: Date | null
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.tableName).toEqual("public.user")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          reference: "1:1",
          name: "email",
          entity: "Email",
          nullable: false,
          mappedBy: "user",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const emailMetaData = MetadataStorage.getMetadataFromDecorator(Email)
      expect(emailMetaData.className).toEqual("Email")
      expect(emailMetaData.path).toEqual("Email")
      expect(emailMetaData.tableName).toEqual("platform.email")
      expect(emailMetaData.properties).toEqual({
        email: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          reference: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          reference: "1:1",
          entity: "User",
          nullable: false,
          mappedBy: "email",
          owner: true,
        },
        user_id: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          nullable: false,
          name: "user_id",
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })
  })

  describe("Entity builder | manyToMany", () => {
    test("define manyToMany relationship", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
        users: model.manyToMany(() => user),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team),
      })

      const User = toMikroORMEntity(user)
      const Team = toMikroORMEntity(team)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: EntityConstructor<{
          id: number
          name: string
          users: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: EntityConstructor<{
          id: number
          username: string
          teams: EntityConstructor<{
            id: number
            name: string
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          reference: "m:n",
          name: "teams",
          entity: "Team",
          pivotTable: "team_users",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("Team")
      expect(teamMetaData.path).toEqual("Team")
      expect(teamMetaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          reference: "m:n",
          name: "users",
          entity: "User",
          pivotTable: "team_users",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define mappedBy on one side", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
        users: model.manyToMany(() => user),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, { mappedBy: "users" }),
      })

      const User = toMikroORMEntity(user)
      const Team = toMikroORMEntity(team)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: EntityConstructor<{
          id: number
          name: string
          users: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: EntityConstructor<{
          id: number
          username: string
          teams: EntityConstructor<{
            id: number
            name: string
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          reference: "m:n",
          name: "teams",
          entity: "Team",
          pivotTable: "team_users",
          mappedBy: "users",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("Team")
      expect(teamMetaData.path).toEqual("Team")
      expect(teamMetaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          reference: "m:n",
          name: "users",
          entity: "User",
          pivotTable: "team_users",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("throw error when unable to locate relationship via mappedBy", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, { mappedBy: "users" }),
      })

      expect(() => toMikroORMEntity(user)).toThrow(
        'Missing property "users" on "Team" entity. Make sure to define it as a relationship'
      )
    })

    test("throw error when mappedBy relationship is not a manyToMany", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
        users: model.belongsTo(() => team, { mappedBy: "teams" }),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, { mappedBy: "users" }),
      })

      expect(() => toMikroORMEntity(user)).toThrow(
        'Invalid relationship reference for "users" on "Team" entity. Make sure to define a manyToMany relationship'
      )
    })

    test("define mappedBy on both sides", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
        users: model.manyToMany(() => user, { mappedBy: "teams" }),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, { mappedBy: "users" }),
      })

      const [User, Team] = toMikroOrmEntities([user, team, {}])

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: EntityConstructor<{
          id: number
          name: string
          users: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: EntityConstructor<{
          id: number
          username: string
          teams: EntityConstructor<{
            id: number
            name: string
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          reference: "m:n",
          name: "teams",
          entity: "Team",
          pivotTable: "team_users",
          mappedBy: "users",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("Team")
      expect(teamMetaData.path).toEqual("Team")
      expect(teamMetaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          reference: "m:n",
          name: "users",
          entity: "User",
          pivotTable: "team_users",
          /**
           * The other side should be inversed in order for Mikro ORM
           * to work. Both sides cannot have mappedBy.
           */
          inversedBy: "teams",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define mappedBy on both sides and reverse order of registering entities", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
        users: model.manyToMany(() => user, { mappedBy: "teams" }),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, { mappedBy: "users" }),
      })

      const entityBuilder = createMikrORMEntity()
      const Team = entityBuilder(team)
      const User = entityBuilder(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: EntityConstructor<{
          id: number
          name: string
          users: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: EntityConstructor<{
          id: number
          username: string
          teams: EntityConstructor<{
            id: number
            name: string
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          reference: "m:n",
          name: "teams",
          entity: "Team",
          pivotTable: "team_users",
          /**
           * The other side should be inversed in order for Mikro ORM
           * to work. Both sides cannot have mappedBy.
           */
          inversedBy: "users",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("Team")
      expect(teamMetaData.path).toEqual("Team")
      expect(teamMetaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          reference: "m:n",
          name: "users",
          entity: "User",
          pivotTable: "team_users",
          mappedBy: "teams",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define multiple many to many relationships to the same entity", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
        activeTeamsUsers: model.manyToMany(() => user, {
          mappedBy: "activeTeams",
        }),
        users: model.manyToMany(() => user, { mappedBy: "teams" }),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        activeTeams: model.manyToMany(() => team, {
          mappedBy: "activeTeamsUsers",
        }),
        teams: model.manyToMany(() => team, { mappedBy: "users" }),
      })

      const entityBuilder = createMikrORMEntity()
      const Team = entityBuilder(team)
      const User = entityBuilder(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: EntityConstructor<{
          id: number
          name: string
          users: EntityConstructor<{
            id: number
            username: string
          }>
        }>
        activeTeams: EntityConstructor<{
          id: number
          name: string
          users: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: EntityConstructor<{
          id: number
          username: string
          teams: EntityConstructor<{
            id: number
            name: string
          }>
          activeTeams: EntityConstructor<{
            id: number
            name: string
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          reference: "m:n",
          name: "teams",
          entity: "Team",
          pivotTable: "team_users",
          /**
           * The other side should be inversed in order for Mikro ORM
           * to work. Both sides cannot have mappedBy.
           */
          inversedBy: "users",
        },
        activeTeams: {
          reference: "m:n",
          name: "activeTeams",
          entity: "Team",
          pivotTable: "team_users",
          inversedBy: "activeTeamsUsers",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("Team")
      expect(teamMetaData.path).toEqual("Team")
      expect(teamMetaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          reference: "m:n",
          name: "users",
          entity: "User",
          pivotTable: "team_users",
          mappedBy: "teams",
        },
        activeTeamsUsers: {
          reference: "m:n",
          name: "activeTeamsUsers",
          entity: "User",
          pivotTable: "team_users",
          mappedBy: "activeTeams",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define manyToMany relationship when entity names has pg schema name", () => {
      const team = model.define("platform.team", {
        id: model.number(),
        name: model.text(),
        users: model.manyToMany(() => user),
      })

      const user = model.define("platform.user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team),
      })

      const User = toMikroORMEntity(user)
      const Team = toMikroORMEntity(team)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: EntityConstructor<{
          id: number
          name: string
          users: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: EntityConstructor<{
          id: number
          username: string
          teams: EntityConstructor<{
            id: number
            name: string
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.tableName).toEqual("platform.user")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          reference: "m:n",
          name: "teams",
          entity: "Team",
          pivotTable: "platform.team_users",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("Team")
      expect(teamMetaData.path).toEqual("Team")
      expect(teamMetaData.tableName).toEqual("platform.team")
      expect(teamMetaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          reference: "m:n",
          name: "users",
          entity: "User",
          pivotTable: "platform.team_users",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define custom pivot table name", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
        users: model.manyToMany(() => user, {
          pivotTable: "users_teams",
        }),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, { pivotTable: "users_teams" }),
      })

      const User = toMikroORMEntity(user)
      const Team = toMikroORMEntity(team)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: EntityConstructor<{
          id: number
          name: string
          users: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: EntityConstructor<{
          id: number
          username: string
          teams: EntityConstructor<{
            id: number
            name: string
          }>
        }>
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          reference: "m:n",
          name: "teams",
          entity: "Team",
          pivotTable: "users_teams",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("Team")
      expect(teamMetaData.path).toEqual("Team")
      expect(teamMetaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          reference: "m:n",
          name: "users",
          entity: "User",
          pivotTable: "users_teams",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define custom pivot entity", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
        users: model.manyToMany(() => user, {
          pivotEntity: () => squad,
        }),
      })

      const squad = model.define("teamUsers", {
        id: model.number(),
        user: model.belongsTo(() => user, { mappedBy: "teams" }),
        team: model.belongsTo(() => team, { mappedBy: "users" }),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, { pivotEntity: () => squad }),
      })

      const [User, Team, Squad] = toMikroOrmEntities([user, team, squad])

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: EntityConstructor<{
          id: number
          name: string
          users: EntityConstructor<{
            id: number
            username: string
          }>
        }>
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: EntityConstructor<{
          id: number
          username: string
          teams: EntityConstructor<{
            id: number
            name: string
          }>
        }>
      }>()

      const squadMetaData = MetadataStorage.getMetadataFromDecorator(Squad)
      expect(squadMetaData.className).toEqual("TeamUsers")
      expect(squadMetaData.path).toEqual("TeamUsers")
      expect(squadMetaData.tableName).toEqual("team_users")

      expect(squadMetaData.properties).toEqual({
        id: {
          reference: "scalar",
          columnType: "integer",
          type: "number",
          nullable: false,
          name: "id",
          getter: false,
          setter: false,
        },
        user_id: {
          name: "user_id",
          reference: "m:1",
          entity: "User",
          columnType: "text",
          mapToPk: true,
          fieldName: "user_id",
          nullable: false,
        },
        user: {
          reference: "scalar",
          type: "User",
          persist: false,
          nullable: false,
          name: "user",
          getter: false,
          setter: false,
        },
        team_id: {
          name: "team_id",
          reference: "m:1",
          entity: "Team",
          columnType: "text",
          mapToPk: true,
          fieldName: "team_id",
          nullable: false,
        },
        team: {
          reference: "scalar",
          type: "Team",
          persist: false,
          nullable: false,
          name: "team",
          getter: false,
          setter: false,
        },
        created_at: {
          reference: "scalar",
          columnType: "timestamptz",
          type: "date",
          nullable: false,
          onCreate: expect.any(Function),
          defaultRaw: "now()",
          name: "created_at",
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          columnType: "timestamptz",
          type: "date",
          nullable: false,
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          defaultRaw: "now()",
          name: "updated_at",
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          columnType: "timestamptz",
          type: "date",
          nullable: true,
          name: "deleted_at",
          getter: false,
          setter: false,
        },
      })

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          reference: "m:n",
          name: "teams",
          entity: "Team",
          pivotEntity: "TeamUsers",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("Team")
      expect(teamMetaData.path).toEqual("Team")
      expect(teamMetaData.properties).toEqual({
        id: {
          reference: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          reference: "m:n",
          name: "users",
          entity: "User",
          pivotEntity: "TeamUsers",
        },
        created_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          reference: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })
  })
})
