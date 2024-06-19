import { expectTypeOf } from "expect-type"
import { MetadataStorage } from "@mikro-orm/core"
import { EntityConstructor } from "../types"
import { EntityBuilder } from "../entity-builder"
import { createMikrORMEntity } from "../helpers/create-mikro-orm-entity"

describe("Entity builder", () => {
  beforeEach(() => {
    MetadataStorage.clear()
  })

  describe("Entity builder | properties", () => {
    test("define an entity", () => {
      const model = new EntityBuilder()
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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

    test("define a property with default value", () => {
      const model = new EntityBuilder()
      const user = model.define("user", {
        id: model.number(),
        username: model.text().default("foo"),
        email: model.text(),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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
      const model = new EntityBuilder()
      const user = model.define("user", {
        id: model.number(),
        username: model.text().nullable(),
        email: model.text(),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string | null
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
      const model = new EntityBuilder()
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
        role: model.enum(["moderator", "admin", "guest"]),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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
      const model = new EntityBuilder()
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
        role: model.enum(["moderator", "admin", "guest"]).default("guest"),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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
      const model = new EntityBuilder()
      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
        role: model.enum(["moderator", "admin", "guest"]).nullable(),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        role: "moderator" | "admin" | "guest" | null
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
      const model = new EntityBuilder()
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
      const model = new EntityBuilder()
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
      const model = new EntityBuilder()
      const user = model.define("public.user", {
        id: model.number(),
        username: model.text(),
        email: model.text(),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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

  describe("Entity builder | indexes", () => {
    test("define index on a field", () => {
      const model = new EntityBuilder()
      const user = model.define("user", {
        id: model.number().index(),
        username: model.text(),
        email: model.text().unique(),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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
          name: "IDX_user_email",
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email" ON "user" (email) WHERE deleted_at IS NULL',
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
      const model = new EntityBuilder()
      const user = model.define("platform.user", {
        id: model.number().index(),
        username: model.text(),
        email: model.text().unique(),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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
            'CREATE INDEX IF NOT EXISTS "IDX_user_id" ON "platform"."user" (id) WHERE deleted_at IS NULL',
        },
        {
          name: "IDX_user_email",
          expression:
            'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email" ON "platform"."user" (email) WHERE deleted_at IS NULL',
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
      const model = new EntityBuilder()
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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
      const model = new EntityBuilder()
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        emails: model.hasOne(() => email).nullable(),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)

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
      const model = new EntityBuilder()
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.hasOne(() => email, { mappedBy: "owner" }),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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
      const model = new EntityBuilder()
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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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

      const Email = entityBuilder(email)
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
      const model = new EntityBuilder()
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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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

      const Email = entityBuilder(email)
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
      const model = new EntityBuilder()
      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        emails: model.hasMany(() => email),
      })

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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
      const model = new EntityBuilder()
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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)

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
      const model = new EntityBuilder()
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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
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
      const model = new EntityBuilder()
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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      const Email = entityBuilder(email)
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
          reference: "m:1",
          name: "user",
          entity: "User",
          persist: false,
        },
        user_id: {
          columnType: "text",
          entity: "User",
          fieldName: "user_id",
          mapToPk: true,
          name: "user_id",
          nullable: false,
          reference: "m:1",
          onDelete: "cascade",
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
      const model = new EntityBuilder()

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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      const Email = entityBuilder(email)

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
          reference: "1:1",
          name: "user",
          entity: "User",
          nullable: false,
          owner: true,
          mappedBy: "email",
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
      const model = new EntityBuilder()

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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      const Email = entityBuilder(email)

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
          reference: "1:1",
          name: "user",
          entity: "User",
          nullable: true,
          owner: true,
          mappedBy: "email",
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
      const model = new EntityBuilder()

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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      const Email = entityBuilder(email)

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
          reference: "m:1",
          name: "user",
          entity: "User",
          persist: false,
        },
        user_id: {
          columnType: "text",
          entity: "User",
          fieldName: "user_id",
          mapToPk: true,
          name: "user_id",
          nullable: false,
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

    test("define belongsTo with hasMany as nullable", () => {
      const model = new EntityBuilder()

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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      const Email = entityBuilder(email)

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
          reference: "m:1",
          name: "user",
          entity: "User",
          persist: false,
        },
        user_id: {
          columnType: "text",
          entity: "User",
          fieldName: "user_id",
          mapToPk: true,
          name: "user_id",
          nullable: true,
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

    test("throw error when other side relationship is missing", () => {
      const model = new EntityBuilder()

      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
      })

      const entityBuilder = createMikrORMEntity()
      expect(() => entityBuilder(email)).toThrow(
        'Missing property "email" on "user" entity. Make sure to define it as a relationship'
      )
    })

    test("throw error when other side relationship is invalid", () => {
      const model = new EntityBuilder()

      const email = model.define("email", {
        email: model.text(),
        isVerified: model.boolean(),
        user: model.belongsTo(() => user),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        email: model.manyToMany(() => email),
      })

      const entityBuilder = createMikrORMEntity()
      expect(() => entityBuilder(email)).toThrow(
        'Invalid relationship reference for "email" on "user" entity. Make sure to define a hasOne or hasMany relationship'
      )
    })

    test("throw error when cascading a parent from a child", () => {
      const model = new EntityBuilder()

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
  })

  describe("Entity builder | manyToMany", () => {
    test("define manyToMany relationship", () => {
      const model = new EntityBuilder()
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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      const Team = entityBuilder(team)

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
      const model = new EntityBuilder()
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

      const entityBuilder = createMikrORMEntity()
      const User = entityBuilder(user)
      const Team = entityBuilder(team)

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
      const model = new EntityBuilder()
      const team = model.define("team", {
        id: model.number(),
        name: model.text(),
      })

      const user = model.define("user", {
        id: model.number(),
        username: model.text(),
        teams: model.manyToMany(() => team, { mappedBy: "users" }),
      })

      const entityBuilder = createMikrORMEntity()
      expect(() => entityBuilder(user)).toThrow(
        'Missing property "users" on "team" entity. Make sure to define it as a relationship'
      )
    })

    test("throw error when mappedBy relationship is not a manyToMany", () => {
      const model = new EntityBuilder()
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

      const entityBuilder = createMikrORMEntity()
      expect(() => entityBuilder(user)).toThrow(
        'Invalid relationship reference for "users" on "team" entity. Make sure to define a manyToMany relationship'
      )
    })

    test("define mappedBy on both sides", () => {
      const model = new EntityBuilder()
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
      const User = entityBuilder(user)
      const Team = entityBuilder(team)

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
      const model = new EntityBuilder()
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
      const model = new EntityBuilder()
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
  })
})
