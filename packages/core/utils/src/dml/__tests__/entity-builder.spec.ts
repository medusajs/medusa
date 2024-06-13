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

      const User = createMikrORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
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
          reference: "scalar",
          type: "string",
          columnType: "text",
          name: "email",
          nullable: false,
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

      const User = createMikrORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
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
      })
    })

    test("mark property nullable", () => {
      const model = new EntityBuilder()
      const user = model.define("user", {
        id: model.number(),
        username: model.text().nullable(),
        email: model.text(),
      })

      const User = createMikrORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string | null
        email: string
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

      const User = createMikrORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        role: "moderator" | "admin" | "guest"
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

      const User = createMikrORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        role: "moderator" | "admin" | "guest"
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

      const User = createMikrORMEntity(user)
      expectTypeOf(new User()).toMatchTypeOf<{
        id: number
        username: string
        email: string
        role: "moderator" | "admin" | "guest" | null
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
      })
      expect(metaData.properties["role"].items()).toEqual([
        "moderator",
        "admin",
        "guest",
      ])
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

      const User = createMikrORMEntity(user)
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

      const User = createMikrORMEntity(user)

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
          reference: "1:1",
          name: "emails",
          entity: "Email",
          nullable: true,
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

      const User = createMikrORMEntity(user)
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

      const User = createMikrORMEntity(user)

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

      const User = createMikrORMEntity(user)
      const Email = createMikrORMEntity(email)

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

      const User = createMikrORMEntity(user)
      const Email = createMikrORMEntity(email)

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

      const User = createMikrORMEntity(user)
      const Email = createMikrORMEntity(email)

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

      const User = createMikrORMEntity(user)
      const Email = createMikrORMEntity(email)

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

      expect(() => createMikrORMEntity(email)).toThrow(
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

      expect(() => createMikrORMEntity(email)).toThrow(
        'Invalid relationship reference for "email" on "user" entity. Make sure to define a hasOne or hasMany relationship'
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

      const User = createMikrORMEntity(user)
      const Team = createMikrORMEntity(team)

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
        },
      })
    })
  })
})
