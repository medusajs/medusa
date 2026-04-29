import {
  ArrayType,
  EntityMetadata,
  MetadataStorage,
} from "@medusajs/deps/mikro-orm/core"
import { expectTypeOf } from "expect-type"
import { DmlEntity } from "../entity"
import { model } from "../entity-builder"
import { DuplicateIdPropertyError } from "../errors"
import {
  mikroORMEntityBuilder,
  toMikroORMEntity,
  toMikroOrmEntities,
} from "../helpers/create-mikro-orm-entity"

describe("Entity builder", () => {
  beforeEach(() => {
    MetadataStorage.clear()
    mikroORMEntityBuilder.clear()
  })

  const defaultColumnMetadata = {
    created_at: {
      columnType: "timestamptz",
      defaultRaw: "now()",
      getter: false,
      name: "created_at",
      fieldName: "created_at",
      nullable: false,
      onCreate: expect.any(Function),
      kind: "scalar",
      setter: false,
      type: "date",
    },
    deleted_at: {
      columnType: "timestamptz",
      getter: false,
      name: "deleted_at",
      fieldName: "deleted_at",
      nullable: true,
      kind: "scalar",
      setter: false,
      type: "date",
    },
    updated_at: {
      columnType: "timestamptz",
      defaultRaw: "now()",
      getter: false,
      name: "updated_at",
      fieldName: "updated_at",
      nullable: false,
      onCreate: expect.any(Function),
      onUpdate: expect.any(Function),
      kind: "scalar",
      setter: false,
      type: "date",
    },
  }

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
        phones: model.array(),
      })

      expect(user.name).toEqual("User")
      expect(user.parse().tableName).toEqual("user")

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        spend_limit: number
        raw_spend_limit: Record<string, unknown>
        phones: string[]
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
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
          fieldName: "spend_limit",
          nullable: false,
          kind: "scalar",
          setter: true,
          trackChanges: false,
          type: expect.any(Function),
          runtimeType: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          fieldName: "raw_spend_limit",
          nullable: false,
          kind: "scalar",
          setter: false,
          type: "any",
        },
        phones: {
          getter: false,
          name: "phones",
          fieldName: "phones",
          nullable: false,
          kind: "scalar",
          setter: false,
          type: ArrayType,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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

      expect(user.name).toEqual("User")
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
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
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
          fieldName: "spend_limit",
          nullable: false,
          kind: "scalar",
          setter: true,
          trackChanges: false,
          type: expect.any(Function),
          runtimeType: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          fieldName: "raw_spend_limit",
          nullable: false,
          kind: "scalar",
          setter: false,
          type: "any",
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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

      expect(user.name).toEqual("UserRole")
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
        freeTextSearch_UserRole: {
          cond: expect.any(Function),
          name: "freeTextSearch_UserRole",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
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
          fieldName: "spend_limit",
          nullable: false,
          kind: "scalar",
          setter: true,
          trackChanges: false,
          type: expect.any(Function),
          runtimeType: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          fieldName: "raw_spend_limit",
          nullable: false,
          kind: "scalar",
          setter: false,
          type: "any",
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          default: "foo",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        spend_limit: {
          columnType: "numeric",
          default: 500.4,
          getter: true,
          name: "spend_limit",
          fieldName: "spend_limit",
          nullable: false,
          kind: "scalar",
          setter: true,
          trackChanges: false,
          type: expect.any(Function),
          runtimeType: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          default: '{"value":"500.4","precision":20}',
          getter: false,
          name: "raw_spend_limit",
          fieldName: "raw_spend_limit",
          nullable: false,
          kind: "scalar",
          setter: false,
          type: "any",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("should throw on duplicate id definition", () => {
      const user = model.define("user", {
        id: model.id().primaryKey(),
        uuid: model.id(),
        name: model.text(),
      })

      let err
      try {
        toMikroORMEntity(user)
      } catch (e) {
        err = e
      }

      expect(err).toBeInstanceOf(DuplicateIdPropertyError)
      expect(err.message).toBe(
        "The model User can only have one usage of the id() property"
      )
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
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
          searchable: true,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        spend_limit: {
          columnType: "numeric",
          default: 500.4,
          getter: true,
          name: "spend_limit",
          fieldName: "spend_limit",
          nullable: false,
          kind: "scalar",
          setter: true,
          trackChanges: false,
          type: expect.any(Function),
          runtimeType: "any",
        },
        raw_spend_limit: {
          columnType: "jsonb",
          default: '{"value":"500.4","precision":20}',
          getter: false,
          name: "raw_spend_limit",
          fieldName: "raw_spend_limit",
          nullable: false,
          kind: "scalar",
          setter: false,
          type: "any",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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

      expect(userInstance.username).toEqual(undefined)

      expect(userInstance.spend_limit).toEqual(undefined)
      expect(userInstance.raw_spend_limit).toEqual(undefined)

      userInstance.username = "john"
      expect(userInstance.username).toEqual("john")

      userInstance.spend_limit = 150.5
      expect(userInstance.spend_limit).toEqual(150.5)
      expect(userInstance.raw_spend_limit).toEqual({
        precision: 20,
        value: "150.5",
      })

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: true,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        raw_spend_limit: {
          columnType: "jsonb",
          getter: false,
          name: "raw_spend_limit",
          fieldName: "raw_spend_limit",
          nullable: true,
          kind: "scalar",
          setter: false,
          type: "any",
        },
        spend_limit: {
          columnType: "numeric",
          getter: true,
          name: "spend_limit",
          fieldName: "spend_limit",
          nullable: true,
          kind: "scalar",
          setter: true,
          trackChanges: false,
          type: expect.any(Function),
          runtimeType: "any",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        role: {
          kind: "scalar",
          enum: true,
          items: expect.any(Function),
          nullable: false,
          name: "role",
          fieldName: "role",
          type: "string",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
      expectTypeOf(new User()).toEqualTypeOf<{
        id: number
        username: string
        email: string
        role: "moderator" | "admin" | "guest"
        deleted_at: Date | null
        created_at: Date
        updated_at: Date
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)

      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        role: {
          kind: "scalar",
          enum: true,
          default: "guest",
          items: expect.any(Function),
          nullable: false,
          name: "role",
          fieldName: "role",
          type: "string",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
      expect(userInstance.role).toEqual(undefined)

      userInstance.role = "admin"
      expect(userInstance.role).toEqual("admin")

      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        role: {
          kind: "scalar",
          enum: true,
          items: expect.any(Function),
          nullable: true,
          name: "role",
          fieldName: "role",
          type: "string",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define JSON property with default value", () => {
      const user = model.define("user", {
        id: model.number(),
        email: model.text(),
        phones: model.json().default({ number: "22222222" }),
      })

      expect(user.name).toEqual("User")
      expect(user.parse().tableName).toEqual("user")

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        email: string
        phones: Record<string, unknown>
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        phones: {
          getter: false,
          name: "phones",
          fieldName: "phones",
          nullable: false,
          kind: "scalar",
          default: JSON.stringify({ number: "22222222" }),
          setter: false,
          columnType: "jsonb",
          type: "any",
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define a float property", () => {
      const tax = model.define("tax", {
        id: model.number(),
        rate: model.float(),
      })

      expect(tax.name).toEqual("Tax")
      expect(tax.parse().tableName).toEqual("tax")

      const Tax = toMikroORMEntity(tax)
      expectTypeOf(new Tax()).toMatchTypeOf<{
        id: number
        rate: number
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(Tax)
      expect(metaData.className).toEqual("Tax")
      expect(metaData.path).toEqual("Tax")

      expect(metaData.filters).toEqual({
        freeTextSearch_Tax: {
          cond: expect.any(Function),
          name: "freeTextSearch_Tax",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        rate: {
          kind: "scalar",
          type: "number",
          runtimeType: "number",
          columnType: "real",
          name: "rate",
          fieldName: "rate",
          serializer: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })
  })

  describe("Entity builder | relationships", () => {
    test("should mark a relationship as searchable", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        emails: model.hasMany(() => email).searchable(),
      })

      const email = model.define("email", {
        id: model.number(),
        email: model.text(),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        emails: { id: number; email: string }[]
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          cascade: undefined,
          entity: "Email",
          mappedBy: "user",
          name: "emails",
          orphanRemoval: true,
          kind: "1:m",
          searchable: true,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        beforeCreate: [
          "generateId",
          "deleted_at_setDefaultValueOnBeforeCreate",
        ],
        onInit: ["generateId"],
      })

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("mark id as primary", () => {
      const user = model.define("user", {
        id: model.id().primaryKey(),
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
        beforeCreate: [
          "generateId",
          "deleted_at_setDefaultValueOnBeforeCreate",
        ],
        onInit: ["generateId"],
      })

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "id",
          fieldName: "id",
          nullable: false,
          primary: true,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      expect(userInstance.id).toBeDefined()
    })

    test("define prefix for the id", () => {
      const user = model.define("user", {
        id: model.id({ prefix: "us" }).primaryKey(),
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
        beforeCreate: [
          "generateId",
          "deleted_at_setDefaultValueOnBeforeCreate",
        ],
        onInit: ["generateId"],
      })

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "id",
          fieldName: "id",
          nullable: false,
          primary: true,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      expect(userInstance.id.startsWith("us_")).toBeTruthy()
    })
  })

  describe("Entity builder | primaryKey", () => {
    test("should infer primaryKeys from a model", () => {
      const user = model.define("user", {
        id: model.id().primaryKey(),
        email: model.text().primaryKey(),
        account_id: model.number(),
      })

      const User = toMikroORMEntity(user)
      const metaData = MetadataStorage.getMetadataFromDecorator(
        User
      ) as unknown as EntityMetadata<InstanceType<typeof User>>

      expect(metaData.properties.id).toEqual({
        columnType: "text",
        name: "id",
        fieldName: "id",
        nullable: false,
        kind: "scalar",
        type: "string",
        primary: true,
      })
      expect(metaData.properties.email).toEqual({
        columnType: "text",
        name: "email",
        fieldName: "email",
        nullable: false,
        kind: "scalar",
        type: "string",
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
            'CREATE INDEX IF NOT EXISTS "IDX_user_id" ON "user" ("id") WHERE deleted_at IS NULL',
        },
        {
          name: "IDX_user_email_unique",
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_unique" ON "user" ("email") WHERE deleted_at IS NULL',
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "user" ("deleted_at") WHERE deleted_at IS NULL',
          name: "IDX_user_deleted_at",
        },
      ])

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
            'CREATE INDEX IF NOT EXISTS "IDX_user_id" ON "platform"."user" ("id") WHERE deleted_at IS NULL',
        },
        {
          name: "IDX_user_email_unique",
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_unique" ON "platform"."user" ("email") WHERE deleted_at IS NULL',
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "platform"."user" ("deleted_at") WHERE deleted_at IS NULL',
          name: "IDX_user_deleted_at",
        },
      ])

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define index on a field using camelCase name", () => {
      const user = model.define("user", {
        id: model.number().index(),
        username: model.text(),
        myEmail: model.text().unique(),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        myEmail: string
        deleted_at: Date | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")

      expect(metaData.indexes).toEqual([
        {
          name: "IDX_user_id",
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_id" ON "user" ("id") WHERE deleted_at IS NULL',
        },
        {
          name: "IDX_user_myEmail_unique",
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_myEmail_unique" ON "user" ("myEmail") WHERE deleted_at IS NULL',
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "user" ("deleted_at") WHERE deleted_at IS NULL',
          name: "IDX_user_deleted_at",
        },
      ])

      expect(metaData.filters).toEqual({
        freeTextSearch_User: {
          cond: expect.any(Function),
          name: "freeTextSearch_User",
        },
        softDeletable: {
          name: "softDeletable",
          cond: expect.any(Function),
          default: true,
          args: false,
        },
      })

      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        myEmail: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "myEmail",
          fieldName: "myEmail",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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

      expectTypeOf(new User()).toEqualTypeOf<{
        id: number
        username: string
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
        email: {
          email: string
          isVerified: boolean
          created_at: Date
          updated_at: Date
          deleted_at: Date | null
        }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          mappedBy: "user",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        emails: {
          email: string
          isVerified: boolean
          deleted_at: Date | null
        } | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          kind: "1:1",
          name: "emails",
          entity: "Email",
          nullable: true,
          mappedBy: "user",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define custom mappedBy key to undefined to not get the auto generated value", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email, { mappedBy: undefined }),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: { email: string; isVerified: boolean }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          onDelete: undefined,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        email: { email: string; isVerified: boolean }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          mappedBy: "owner",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        email: { email: string; isVerified: boolean }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          mappedBy: "user",
          cascade: ["persist", "soft-remove"],
          deleteRule: "cascade",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        email: {
          email: string
          isVerified: boolean
          user: {
            id: number
            username: string
          }
        }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          mappedBy: "user",
          deleteRule: "cascade",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          entity: "User",
          fieldName: "user_id",
          mappedBy: "email",
          name: "user",
          nullable: false,
          deleteRule: "cascade",
          owner: true,
          kind: "1:1",
          cascade: ["persist", "soft-remove"],
          unique: false,
        },
        user_id: {
          columnType: "text",
          getter: false,
          persist: false,
          name: "user_id",
          nullable: false,
          formula: expect.any(Function),
          kind: "scalar",
          setter: false,
          type: "string",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })
  })

  describe("Entity builder | hasOneWithFK", () => {
    test("define hasOne relationship with FK enabled", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email, {
          foreignKey: true,
          mappedBy: undefined,
        }),
      })

      const User = toMikroORMEntity(user)

      expectTypeOf(new User()).toEqualTypeOf<{
        id: number
        username: string
        email_id: string
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
        email: {
          email: string
          isVerified: boolean
          created_at: Date
          updated_at: Date
          deleted_at: Date | null
        }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          fieldName: "email_id",
          unique: false,
        },
        email_id: {
          columnType: "text",
          type: "string",
          kind: "scalar",
          name: "email_id",
          formula: expect.any(Function),
          nullable: false,
          persist: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("mark hasOne with FK enabled relationship as nullable", () => {
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        emails: model
          .hasOne(() => email, {
            foreignKey: true,
            mappedBy: undefined,
          })
          .nullable(),
      })

      const User = toMikroORMEntity(user)

      expectTypeOf(new User().emails_id).toEqualTypeOf<string | null>()
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        deleted_at: Date | null
        emails_id: string | null
        emails: {
          email: string
          isVerified: boolean
          deleted_at: Date | null
        } | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          kind: "1:1",
          name: "emails",
          entity: "Email",
          nullable: true,
          fieldName: "emails_id",
          unique: false,
        },
        emails_id: {
          columnType: "text",
          type: "string",
          kind: "scalar",
          name: "emails_id",
          formula: expect.any(Function),
          nullable: true,
          persist: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        email: model.hasOne(() => email, {
          mappedBy: "owner",
          foreignKey: true,
        }),
      })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User().email_id).toEqualTypeOf<string>()
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: { email: string; isVerified: boolean }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          mappedBy: "owner",
          fieldName: "email_id",
          unique: false,
        },
        email_id: {
          columnType: "text",
          type: "string",
          kind: "scalar",
          name: "email_id",
          formula: expect.any(Function),
          nullable: false,
          persist: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          email: model.hasOne(() => email, {
            foreignKey: true,
          }),
        })
        .cascades({
          delete: ["email"],
        })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User().email_id).toEqualTypeOf<string>()
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: { email: string; isVerified: boolean }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          cascade: ["persist", "soft-remove"],
          mappedBy: "user",
          fieldName: "email_id",
          unique: false,
        },
        email_id: {
          columnType: "text",
          type: "string",
          kind: "scalar",
          name: "email_id",
          formula: expect.any(Function),
          nullable: false,
          persist: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          email: model.hasOne(() => email, {
            foreignKey: true,
          }),
        })
        .cascades({
          delete: ["email"],
        })

      const User = toMikroORMEntity(user)
      expectTypeOf(new User().email_id).toEqualTypeOf<string>()
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: {
          email: string
          isVerified: boolean
          user: {
            id: number
            username: string
          }
        }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          cascade: ["persist", "soft-remove"],
          mappedBy: "user",
          fieldName: "email_id",
          unique: false,
        },
        email_id: {
          columnType: "text",
          type: "string",
          kind: "scalar",
          formula: expect.any(Function),
          name: "email_id",
          nullable: false,
          persist: false,
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          entity: "User",
          mappedBy: "email",
          name: "user",
          nullable: false,
          deleteRule: "cascade",
          owner: true,
          kind: "1:1",
          cascade: ["persist", "soft-remove"],
          fieldName: "user_id",
          unique: false,
        },
        user_id: {
          columnType: "text",
          getter: false,
          name: "user_id",
          nullable: false,
          kind: "scalar",
          formula: expect.any(Function),
          setter: false,
          type: "string",
          persist: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })
  })

  describe("Entity builder | indexes", () => {
    test("should define indexes for an entity", () => {
      const group = model.define("group", {
        id: model.number(),
        name: model.text(),
        users: model.hasMany(() => user),
      })

      const user = model
        .define("user", {
          email: model.text(),
          account: model.text(),
          organization: model.text(),
          group: model.belongsTo(() => group, { mappedBy: "users" }),
        })
        .indexes([
          {
            unique: true,
            on: ["email", "account"],
          },
          { on: ["email", "account"] },
          {
            on: ["organization", "account"],
            where: "email IS NOT NULL",
          },
          {
            name: "IDX_unique-name",
            unique: true,
            on: ["organization", "account", "group_id"],
          },
        ])

      const User = toMikroORMEntity(user)
      const metaData = MetadataStorage.getMetadataFromDecorator(User)

      expect(metaData.properties).toEqual({
        email: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        account: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "account",
          fieldName: "account",
          nullable: false,
          getter: false,
          setter: false,
        },
        organization: {
          columnType: "text",
          getter: false,
          name: "organization",
          fieldName: "organization",
          nullable: false,
          kind: "scalar",
          setter: false,
          type: "string",
        },
        group: {
          entity: "Group",
          fieldName: "group_id",
          name: "group",
          nullable: false,
          persist: false,
          kind: "m:1",
        },
        group_id: {
          columnType: "text",
          entity: "Group",
          fieldName: "group_id",
          mapToPk: true,
          name: "group_id",
          nullable: false,
          onDelete: undefined,
          kind: "m:1",
        },
        ...defaultColumnMetadata,
      })

      expect(metaData.indexes).toEqual([
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_group_id" ON "user" ("group_id") WHERE deleted_at IS NULL',
          name: "IDX_user_group_id",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "user" ("deleted_at") WHERE deleted_at IS NULL',
          name: "IDX_user_deleted_at",
        },
        {
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_account_unique" ON "user" ("email", "account") WHERE deleted_at IS NULL',
          name: "IDX_user_email_account_unique",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_email_account" ON "user" ("email", "account") WHERE deleted_at IS NULL',
          name: "IDX_user_email_account",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_organization_account" ON "user" ("organization", "account") WHERE email IS NOT NULL AND deleted_at IS NULL',
          name: "IDX_user_organization_account",
        },
        {
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_unique-name" ON "user" ("organization", "account", "group_id") WHERE deleted_at IS NULL',
          name: "IDX_unique-name",
        },
      ])
    })

    test("should define indexes with a query builder", () => {
      const group = model.define("group", {
        id: model.number(),
        name: model.text(),
        users: model.hasMany(() => user),
      })

      const user = model
        .define("user", {
          email: model.text(),
          account: model.text(),
          organization: model.text(),
          is_owner: model.boolean(),
          group: model.belongsTo(() => group, { mappedBy: "users" }),
        })
        .indexes([
          {
            on: ["organization", "account"],
            where: { email: { $ne: null } },
          },
          {
            name: "IDX-email-account-special",
            on: ["organization", "account"],
            where: {
              email: { $ne: null },
              account: null,
            },
          },
          {
            name: "IDX_unique-name",
            unique: true,
            on: ["organization", "account", "group_id"],
          },
          {
            on: ["organization", "group_id"],
            where: { is_owner: false },
          },
          {
            on: ["account", "group_id"],
            where: { is_owner: true },
          },
        ])

      const metaData = MetadataStorage.getMetadataFromDecorator(
        toMikroORMEntity(user)
      )

      expect(metaData.indexes).toEqual([
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_group_id" ON "user" ("group_id") WHERE deleted_at IS NULL',
          name: "IDX_user_group_id",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "user" ("deleted_at") WHERE deleted_at IS NULL',
          name: "IDX_user_deleted_at",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_organization_account" ON "user" ("organization", "account") WHERE email IS NOT NULL AND deleted_at IS NULL',
          name: "IDX_user_organization_account",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX-email-account-special" ON "user" ("organization", "account") WHERE email IS NOT NULL AND account IS NULL AND deleted_at IS NULL',
          name: "IDX-email-account-special",
        },
        {
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_unique-name" ON "user" ("organization", "account", "group_id") WHERE deleted_at IS NULL',
          name: "IDX_unique-name",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_organization_group_id" ON "user" ("organization", "group_id") WHERE is_owner IS FALSE AND deleted_at IS NULL',
          name: "IDX_user_organization_group_id",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_account_group_id" ON "user" ("account", "group_id") WHERE is_owner IS TRUE AND deleted_at IS NULL',
          name: "IDX_user_account_group_id",
        },
      ])
    })

    test("should throw an error if field is unknown for an index", () => {
      const group = model.define("group", {
        id: model.number(),
        name: model.text(),
        users: model.hasMany(() => user),
      })

      const user = model
        .define("user", {
          email: model.text(),
          account: model.text(),
          organization: model.text(),
          group: model.belongsTo(() => group, { mappedBy: "users" }),
        })
        .indexes([
          {
            // @ts-expect-error
            on: ["email", "account", "doesnotexist", "anotherdoesnotexist"],
          },
        ])

      let err: any

      try {
        toMikroORMEntity(user)
      } catch (e) {
        err = e
      }

      expect(err.message).toEqual(
        `Cannot apply indexes on fields (doesnotexist, anotherdoesnotexist) for model User`
      )
    })

    test("should define indexes for an entity", () => {
      const group = model.define("group", {
        id: model.number(),
        name: model.text(),
        users: model.hasMany(() => user),
      })

      const setting = model.define("setting", {
        name: model.text(),
        user: model.belongsTo(() => user),
      })

      const user = model.define("user", {
        email: model.text(),
        account: model.text(),
        organization: model.text(),
        group: model.belongsTo(() => group, { mappedBy: "users" }),
        setting: model.hasOne(() => setting),
      })

      const User = toMikroORMEntity(user)
      const metaData = MetadataStorage.getMetadataFromDecorator(User)

      expect(metaData.indexes).toEqual([
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_group_id" ON "user" ("group_id") WHERE deleted_at IS NULL',
          name: "IDX_user_group_id",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "user" ("deleted_at") WHERE deleted_at IS NULL',
          name: "IDX_user_deleted_at",
        },
      ])

      const Setting = toMikroORMEntity(setting)
      const settingMetadata = MetadataStorage.getMetadataFromDecorator(Setting)

      expect(settingMetadata.indexes).toEqual([
        {
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_setting_user_id_unique" ON "setting" ("user_id") WHERE deleted_at IS NULL',
          name: "IDX_setting_user_id_unique",
        },
        {
          expression:
            'CREATE INDEX IF NOT EXISTS "IDX_setting_deleted_at" ON "setting" ("deleted_at") WHERE deleted_at IS NULL',
          name: "IDX_setting_deleted_at",
        },
      ])
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
        emails: { email: string; isVerified: boolean }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          kind: "1:m",
          name: "emails",
          entity: "Email",
          orphanRemoval: true,
          mappedBy: "user",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        emails: { email: string; isVerified: boolean }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          kind: "1:m",
          name: "emails",
          entity: "Email",
          mappedBy: "the_user",
          orphanRemoval: true,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        emails: { email: string; isVerified: boolean }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          kind: "1:m",
          name: "emails",
          entity: "Email",
          orphanRemoval: true,
          mappedBy: "user",
          cascade: ["persist", "soft-remove"],
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        emails: { email: string; isVerified: boolean }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          kind: "1:m",
          name: "emails",
          entity: "Email",
          orphanRemoval: true,
          mappedBy: "user",
          cascade: ["persist", "soft-remove"],
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          entity: "User",
          fieldName: "user_id",
          name: "user",
          nullable: false,
          persist: false,
          kind: "m:1",
        },
        user_id: {
          columnType: "text",
          entity: "User",
          mapToPk: true,
          fieldName: "user_id",
          name: "user_id",
          nullable: false,
          deleteRule: "cascade",
          kind: "m:1",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        email: {
          email: string
          isVerified: boolean
          deleted_at: Date | null
          user: {
            id: number
            username: string
            deleted_at: Date | null
          }
        }
      }>()

      const userInstance = new User()
      expectTypeOf<
        (typeof userInstance)["email"]["user_id"]
      >().toEqualTypeOf<string>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        deleted_at: Date | null
        user: {
          id: number
          username: string
          deleted_at: Date | null
          email: {
            email: string
            isVerified: boolean
            deleted_at: Date | null
          }
        }
      }>()
      expectTypeOf(new Email().user_id).toEqualTypeOf<string>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          mappedBy: "user",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          fieldName: "user_id",
          kind: "1:1",
          entity: "User",
          nullable: false,
          mappedBy: "email",
          onDelete: undefined,
          owner: true,
          unique: false,
        },
        user_id: {
          kind: "scalar",
          persist: false,
          type: "string",
          formula: expect.any(Function),
          columnType: "text",
          nullable: false,
          name: "user_id",
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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

      expectTypeOf(new User()).toEqualTypeOf<{
        id: number
        username: string
        email: {
          email: string
          isVerified: boolean
          user: {
            id: number
            username: string
            email: any
            created_at: Date
            updated_at: Date
            deleted_at: Date | null
          }
          created_at: Date
          updated_at: Date
          deleted_at: Date | null
          user_id: string | null
        }
        created_at: Date
        updated_at: Date
        deleted_at: Date | null
      }>({} as any)

      const userInstance = new User()
      expectTypeOf<(typeof userInstance)["email"]["user_id"]>().toEqualTypeOf<
        string | null
      >()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        user: {
          id: number
          username: string
          email: {
            email: string
            isVerified: boolean
            user: any
            created_at: Date
            updated_at: Date
            deleted_at: Date | null
            user_id: string | null
          }
        } | null
      }>()
      expectTypeOf(new Email().user_id).toEqualTypeOf<string | null>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          mappedBy: "user",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          fieldName: "user_id",
          kind: "1:1",
          entity: "User",
          nullable: true,
          onDelete: undefined,
          mappedBy: "email",
          owner: true,
          unique: false,
        },
        user_id: {
          kind: "scalar",
          persist: false,
          type: "string",
          columnType: "text",
          nullable: true,
          formula: expect.any(Function),
          name: "user_id",
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        emails: {
          email: string
          isVerified: boolean
          user: {
            id: number
            username: string
          }
        }[]
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        user: {
          id: number
          username: string
          emails: {
            email: string
            isVerified: boolean
          }[]
        }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          kind: "1:m",
          name: "emails",
          entity: "Email",
          mappedBy: "user",
          orphanRemoval: true,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          kind: "m:1",
          entity: "User",
          fieldName: "user_id",
          persist: false,
          nullable: false,
        },
        user_id: {
          name: "user_id",
          kind: "m:1",
          entity: "User",
          columnType: "text",
          mapToPk: true,
          fieldName: "user_id",
          nullable: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        emails: {
          email: string
          isVerified: boolean
          user: {
            id: number
            username: string
          } | null
        }[]
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        user: {
          id: number
          username: string
          emails: {
            email: string
            isVerified: boolean
          }[]
        } | null
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        emails: {
          kind: "1:m",
          name: "emails",
          entity: "Email",
          mappedBy: "user",
          orphanRemoval: true,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          kind: "m:1",
          fieldName: "user_id",
          entity: "User",
          persist: false,
          nullable: true,
        },
        user_id: {
          name: "user_id",
          kind: "m:1",
          entity: "User",
          columnType: "text",
          mapToPk: true,
          fieldName: "user_id",
          nullable: true,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
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
        'Cannot cascade delete "user" relationship(s) from "Email" entity. Child to parent cascades are not allowed'
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
        email: {
          email: string
          isVerified: boolean
          deleted_at: Date | null
          user: {
            id: number
            username: string
            deleted_at: Date | null
          }
        }
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        deleted_at: Date | null
        user: {
          id: number
          username: string
          deleted_at: Date | null
          email: {
            email: string
            isVerified: boolean
            deleted_at: Date | null
          }
        }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.tableName).toEqual("platform.user")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          mappedBy: "user",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          fieldName: "user_id",
          kind: "1:1",
          entity: "User",
          nullable: false,
          mappedBy: "email",
          onDelete: undefined,
          owner: true,
          unique: false,
        },
        user_id: {
          kind: "scalar",
          type: "string",
          persist: false,
          columnType: "text",
          formula: expect.any(Function),
          nullable: false,
          name: "user_id",
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        email: {
          email: string
          isVerified: boolean
          deleted_at: Date | null
          user: {
            id: number
            username: string
            deleted_at: Date | null
          }
        }
      }>()

      expectTypeOf(new Email()).toMatchTypeOf<{
        email: string
        isVerified: boolean
        deleted_at: Date | null
        user: {
          id: number
          username: string
          deleted_at: Date | null
          email: {
            email: string
            isVerified: boolean
            deleted_at: Date | null
          }
        }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.tableName).toEqual("public.user")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        email: {
          kind: "1:1",
          name: "email",
          entity: "Email",
          mappedBy: "user",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          fieldName: "email",
          nullable: false,
          getter: false,
          setter: false,
        },
        isVerified: {
          kind: "scalar",
          type: "boolean",
          columnType: "boolean",
          name: "isVerified",
          fieldName: "isVerified",
          nullable: false,
          getter: false,
          setter: false,
        },
        user: {
          name: "user",
          fieldName: "user_id",
          kind: "1:1",
          entity: "User",
          nullable: false,
          mappedBy: "email",
          onDelete: undefined,
          owner: true,
          unique: false,
        },
        user_id: {
          kind: "scalar",
          persist: false,
          type: "string",
          columnType: "text",
          nullable: false,
          formula: expect.any(Function),
          name: "user_id",
          getter: false,
          setter: false,
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define entity with relationship to itself via hasMany", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        parent: model.belongsTo(() => user, { mappedBy: "children" }),
        children: model.hasMany(() => user, { mappedBy: "parent" }),
      })

      const [User] = toMikroOrmEntities([user])

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        deleted_at: Date | null
        parent: {
          id: number
          username: string
          deleted_at: Date | null
        }
        children: {
          id: number
          username: string
          deleted_at: Date | null
        }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        parent: {
          name: "parent",
          fieldName: "parent_id",
          kind: "m:1",
          entity: "User",
          persist: false,
          nullable: false,
        },
        parent_id: {
          name: "parent_id",
          kind: "m:1",
          entity: "User",
          columnType: "text",
          fieldName: "parent_id",
          mapToPk: true,
          nullable: false,
          onDelete: undefined,
        },
        children: {
          cascade: undefined,
          entity: "User",
          mappedBy: "parent",
          name: "children",
          orphanRemoval: true,
          kind: "1:m",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("define relationship with self via hasOne", () => {
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        parent: model.belongsTo(() => user, { mappedBy: "child" }),
        child: model.hasOne(() => user, { mappedBy: "parent" }),
      })

      const [User] = toMikroOrmEntities([user])

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        deleted_at: Date | null
        parent: {
          id: number
          username: string
          deleted_at: Date | null
        }
        child: {
          id: number
          username: string
          deleted_at: Date | null
        }
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        parent: {
          name: "parent",
          fieldName: "parent_id",
          mappedBy: "child",
          kind: "1:1",
          entity: "User",
          nullable: false,
          onDelete: undefined,
          owner: true,
          unique: false,
        },
        parent_id: {
          name: "parent_id",
          type: "string",
          columnType: "text",
          kind: "scalar",
          formula: expect.any(Function),
          persist: false,
          getter: false,
          setter: false,
          nullable: false,
        },
        child: {
          cascade: undefined,
          entity: "User",
          mappedBy: "parent",
          name: "child",
          kind: "1:1",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        teams: model.manyToMany(() => team, {
          mappedBy: "users",
        }),
      })

      const User = toMikroORMEntity(user)
      const Team = toMikroORMEntity(team)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: {
          id: number
          name: string
          users: {
            id: number
            username: string
          }[]
        }[]
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: {
          id: number
          username: string
          teams: {
            id: number
            name: string
          }[]
        }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          kind: "m:n",
          name: "teams",
          entity: "Team",
          owner: false,
          pivotTable: "team_users",
          mappedBy: "users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          fieldName: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          kind: "m:n",
          name: "users",
          inversedBy: "teams",
          entity: "User",
          owner: true,
          pivotTable: "team_users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        teams: {
          id: number
          name: string
          users: {
            id: number
            username: string
          }[]
        }[]
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: {
          id: number
          username: string
          teams: {
            id: number
            name: string
          }[]
        }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          kind: "m:n",
          name: "teams",
          entity: "Team",
          owner: false,
          pivotTable: "team_users",
          mappedBy: "users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          fieldName: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          kind: "m:n",
          name: "users",
          entity: "User",
          owner: true,
          inversedBy: "teams",
          pivotTable: "team_users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("should define onDelete cascade on pivot entity when applying detach cascade", () => {
      const teamUser = model.define("teamUser", {
        id: model.number(),
        user: model.belongsTo(() => user, { mappedBy: "teams" }),
        team: model.belongsTo(() => team, { mappedBy: "users" }),
      })
      const user = model
        .define("user", {
          id: model.number(),
          username: model.text(),
          teams: model.manyToMany(() => team, {
            pivotEntity: () => teamUser,
          }),
        })
        .cascades({
          detach: ["teams"],
        })

      const team = model
        .define("team", {
          id: model.number(),
          name: model.text(),
          users: model.manyToMany(() => user, {
            pivotEntity: () => teamUser,
          }),
        })
        .cascades({
          detach: ["users"],
        })

      type CascadeDetach = Parameters<(typeof team)["cascades"]>[0]["detach"]

      expectTypeOf<CascadeDetach>().toEqualTypeOf<"users"[] | undefined>()

      const [, , TeamUserEntity] = toMikroOrmEntities([user, team, teamUser])

      const teamUserMetadata =
        MetadataStorage.getMetadataFromDecorator(TeamUserEntity)
      expect(teamUserMetadata.properties).toEqual(
        expect.objectContaining({
          user_id: {
            kind: "scalar",
            type: "string",
            columnType: "text",
            fieldName: "user_id",
            nullable: false,
            name: "user_id",
            getter: false,
            setter: false,
          },
          user: {
            name: "user",
            kind: "m:1",
            entity: "User",
            nullable: false,
            persist: false,
            deleteRule: "cascade",
          },
          team_id: {
            kind: "scalar",
            type: "string",
            columnType: "text",
            fieldName: "team_id",
            nullable: false,
            name: "team_id",
            getter: false,
            setter: false,
          },
          team: {
            name: "team",
            kind: "m:1",
            entity: "Team",
            nullable: false,
            persist: false,
            deleteRule: "cascade",
          },
        })
      )
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
        teams: {
          id: number
          name: string
          users: {
            id: number
            username: string
          }[]
        }[]
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: {
          id: number
          username: string
          teams: {
            id: number
            name: string
          }[]
        }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          kind: "m:n",
          name: "teams",
          entity: "Team",
          owner: false,
          pivotTable: "team_users",
          mappedBy: "users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          fieldName: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          kind: "m:n",
          name: "users",
          entity: "User",
          owner: true,
          pivotTable: "team_users",
          inversedBy: "teams",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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

      const Team = toMikroORMEntity(team)
      const User = toMikroORMEntity(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: {
          id: number
          name: string
          users: {
            id: number
            username: string
          }[]
        }[]
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: {
          id: number
          username: string
          teams: {
            id: number
            name: string
          }[]
        }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          kind: "m:n",
          name: "teams",
          entity: "Team",
          owner: false,
          pivotTable: "team_users",
          mappedBy: "users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          fieldName: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          kind: "m:n",
          name: "users",
          entity: "User",
          owner: true,
          pivotTable: "team_users",
          inversedBy: "teams",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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

      const Team = toMikroORMEntity(team)
      const User = toMikroORMEntity(user)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: {
          id: number
          name: string
          users: {
            id: number
            username: string
          }[]
        }[]
        activeTeams: {
          id: number
          name: string
          users: {
            id: number
            username: string
          }[]
        }[]
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: {
          id: number
          username: string
          teams: {
            id: number
            name: string
          }[]
          activeTeams: {
            id: number
            name: string
          }[]
        }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          kind: "m:n",
          name: "teams",
          entity: "Team",
          owner: false,
          pivotTable: "team_users",
          mappedBy: "users",
        },
        activeTeams: {
          kind: "m:n",
          name: "activeTeams",
          entity: "Team",
          owner: false,
          pivotTable: "team_users",
          mappedBy: "activeTeamsUsers",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          fieldName: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          kind: "m:n",
          name: "users",
          entity: "User",
          owner: true,
          pivotTable: "team_users",
          inversedBy: "teams",
        },
        activeTeamsUsers: {
          kind: "m:n",
          name: "activeTeamsUsers",
          entity: "User",
          owner: true,
          pivotTable: "team_users",
          inversedBy: "activeTeams",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        teams: model.manyToMany(() => team, {
          mappedBy: "users",
        }),
      })

      const User = toMikroORMEntity(user)
      const Team = toMikroORMEntity(team)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: {
          id: number
          name: string
          users: {
            id: number
            username: string
          }[]
        }[]
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: {
          id: number
          username: string
          teams: {
            id: number
            name: string
          }[]
        }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.tableName).toEqual("platform.user")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          kind: "m:n",
          name: "teams",
          entity: "Team",
          owner: false,
          pivotTable: "platform.team_users",
          mappedBy: "users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          fieldName: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          kind: "m:n",
          name: "users",
          entity: "User",
          owner: true,
          inversedBy: "teams",
          pivotTable: "platform.team_users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("should compute the pivot table name correctly", () => {
      const team = model.define("teamSquad", {
        id: model.number(),
        name: model.text(),
        users: model.manyToMany(() => user),
      })

      const user = model.define("RandomUser", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, {
          mappedBy: "users",
        }),
      })

      const User = toMikroORMEntity(user)
      const Team = toMikroORMEntity(team)

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("RandomUser")
      expect(metaData.path).toEqual("RandomUser")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          kind: "m:n",
          name: "teams",
          entity: "TeamSquad",
          owner: true,
          pivotTable: "random_user_team_squads",
          inversedBy: "users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("TeamSquad")
      expect(teamMetaData.path).toEqual("TeamSquad")
      expect(teamMetaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          fieldName: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          kind: "m:n",
          name: "users",
          entity: "RandomUser",
          owner: false,
          mappedBy: "teams",
          pivotTable: "random_user_team_squads",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        users: model.manyToMany(() => user),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, {
          pivotTable: "users_teams",
          mappedBy: "users",
        }),
      })

      const User = toMikroORMEntity(user)
      const Team = toMikroORMEntity(team)

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: {
          id: number
          name: string
          users: {
            id: number
            username: string
          }[]
        }[]
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: {
          id: number
          username: string
          teams: {
            id: number
            name: string
          }[]
        }[]
      }>()

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          kind: "m:n",
          name: "teams",
          entity: "Team",
          owner: true,
          pivotTable: "users_teams",
          inversedBy: "users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          fieldName: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          kind: "m:n",
          name: "users",
          owner: false,
          entity: "User",
          mappedBy: "teams",
          pivotTable: "users_teams",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
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
        teams: model.manyToMany(() => team, {
          pivotEntity: () => squad,
          mappedBy: "users",
        }),
      })

      const [User, Team, Squad] = toMikroOrmEntities([user, team, squad])

      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        teams: {
          id: number
          name: string
          users: {
            id: number
            username: string
          }[]
        }[]
      }>()

      expectTypeOf(new Team()).toMatchTypeOf<{
        id: number
        name: string
        users: {
          id: number
          username: string
          teams: {
            id: number
            name: string
          }[]
        }[]
      }>()

      const squadMetaData = MetadataStorage.getMetadataFromDecorator(Squad)
      expect(squadMetaData.className).toEqual("TeamUsers")
      expect(squadMetaData.path).toEqual("TeamUsers")
      expect(squadMetaData.tableName).toEqual("team_users")

      expect(squadMetaData.properties).toEqual({
        id: {
          kind: "scalar",
          columnType: "integer",
          type: "number",
          nullable: false,
          name: "id",
          fieldName: "id",
          getter: false,
          setter: false,
        },
        user_id: {
          name: "user_id",
          kind: "scalar",
          columnType: "text",
          fieldName: "user_id",
          getter: false,
          setter: false,
          nullable: false,
          type: "string",
        },
        user: {
          kind: "m:1",
          entity: "User",
          persist: false,
          nullable: false,
          name: "user",
        },
        team_id: {
          name: "team_id",
          kind: "scalar",
          columnType: "text",
          fieldName: "team_id",
          nullable: false,
          getter: false,
          setter: false,
          type: "string",
        },
        team: {
          kind: "m:1",
          entity: "Team",
          persist: false,
          nullable: false,
          name: "team",
        },
        created_at: {
          kind: "scalar",
          columnType: "timestamptz",
          type: "date",
          nullable: false,
          onCreate: expect.any(Function),
          defaultRaw: "now()",
          name: "created_at",
          fieldName: "created_at",
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          columnType: "timestamptz",
          type: "date",
          nullable: false,
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          defaultRaw: "now()",
          name: "updated_at",
          fieldName: "updated_at",
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          columnType: "timestamptz",
          type: "date",
          nullable: true,
          name: "deleted_at",
          fieldName: "deleted_at",
          getter: false,
          setter: false,
        },
      })

      const teamMetaData = MetadataStorage.getMetadataFromDecorator(Team)
      expect(teamMetaData.className).toEqual("Team")
      expect(teamMetaData.path).toEqual("Team")
      expect(teamMetaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        name: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "name",
          fieldName: "name",
          nullable: false,
          getter: false,
          setter: false,
        },
        users: {
          kind: "m:n",
          name: "users",
          entity: "User",
          owner: true,
          inversedBy: "teams",
          pivotEntity: "TeamUsers",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })

      const metaData = MetadataStorage.getMetadataFromDecorator(User)
      expect(metaData.className).toEqual("User")
      expect(metaData.path).toEqual("User")
      expect(metaData.properties).toEqual({
        id: {
          kind: "scalar",
          type: "number",
          columnType: "integer",
          name: "id",
          fieldName: "id",
          nullable: false,
          getter: false,
          setter: false,
        },
        username: {
          kind: "scalar",
          type: "string",
          columnType: "text",
          name: "username",
          fieldName: "username",
          nullable: false,
          getter: false,
          setter: false,
        },
        teams: {
          kind: "m:n",
          name: "teams",
          entity: "Team",
          owner: false,
          pivotEntity: "TeamUsers",
          mappedBy: "users",
        },
        created_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "created_at",
          fieldName: "created_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        updated_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "updated_at",
          fieldName: "updated_at",
          defaultRaw: "now()",
          onCreate: expect.any(Function),
          onUpdate: expect.any(Function),
          nullable: false,
          getter: false,
          setter: false,
        },
        deleted_at: {
          kind: "scalar",
          type: "date",
          columnType: "timestamptz",
          name: "deleted_at",
          fieldName: "deleted_at",
          nullable: true,
          getter: false,
          setter: false,
        },
      })
    })

    test("throw error when both sides of relationship defines the pivot table", () => {
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
        users: model.manyToMany(() => user, {
          pivotTable: "user_teams",
        }),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, {
          pivotTable: "team_users",
          mappedBy: "users",
        }),
      })

      expect(() => toMikroORMEntity(user)).toThrow(
        `Invalid relationship reference for "User.teams". Define "pivotTable", "joinColumn", or "inverseJoinColumn" on only one side of the relationship`
      )
    })
  })

  describe("Entity builder | checks", () => {
    test("should define checks for an entity", () => {
      const group = model
        .define("group", {
          id: model.number(),
          name: model.text(),
        })
        .checks([
          (columns) => {
            expectTypeOf(columns).toEqualTypeOf<{
              id: string
              name: string
              created_at: string
              updated_at: string
              deleted_at: string
            }>()
            return `${columns.id} > 1`
          },
        ])

      const Group = toMikroORMEntity(group)
      const metaData = MetadataStorage.getMetadataFromDecorator(Group)

      expect(metaData.checks).toHaveLength(1)
      expect(metaData.checks[0].expression.toString()).toMatchInlineSnapshot(`
        "(columns)=>{
                            (0, _expecttype.expectTypeOf)(columns).toEqualTypeOf();
                            return \`\${columns.id} > 1\`;
                        }"
      `)
    })

    test("should define checks as an object", () => {
      const group = model
        .define("group", {
          id: model.number(),
          name: model.text(),
        })
        .checks([
          {
            name: "my_custom_check",
            expression: (columns) => {
              expectTypeOf(columns).toEqualTypeOf<{
                id: string
                name: string
                created_at: string
                updated_at: string
                deleted_at: string
              }>()
              return `${columns.id} > 1`
            },
          },
        ])

      const Group = toMikroORMEntity(group)
      const metaData = MetadataStorage.getMetadataFromDecorator(Group)

      expect(metaData.checks).toHaveLength(1)
      expect(metaData.checks[0].name).toEqual("my_custom_check")
      expect(metaData.checks[0].expression.toString()).toMatchInlineSnapshot(`
        "(columns)=>{
                                (0, _expecttype.expectTypeOf)(columns).toEqualTypeOf();
                                return \`\${columns.id} > 1\`;
                            }"
      `)
    })

    test("should infer foreign keys inside the checks callback", () => {
      const group = model
        .define("group", {
          id: model.number(),
          name: model.text(),
          parent_group: model.belongsTo(() => group, {
            mappedBy: "groups",
          }),
          groups: model.hasMany(() => group, {
            mappedBy: "parent_group",
          }),
        })
        .checks([
          (columns) => {
            expectTypeOf(columns).toEqualTypeOf<{
              id: string
              name: string
              parent_group_id: string
              created_at: string
              updated_at: string
              deleted_at: string
            }>()
            return `${columns.id} > 1`
          },
        ])

      const Group = toMikroORMEntity(group)
      const metaData = MetadataStorage.getMetadataFromDecorator(Group)

      expect(metaData.checks).toHaveLength(1)
    })
  })
})
