import { expectTypeOf } from "expect-type"
import { MetadataStorage } from "@mikro-orm/core"
import { EntityBuilder } from "../entity_builder"
import { createMikrORMEntity } from "../helpers/create_mikro_orm_entity"
import { EntityConstructor } from "../types"

describe("Entity builder", () => {
  beforeEach(() => {
    MetadataStorage.clear()
  })

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

  test("define an entity with default value", () => {
    const model = new EntityBuilder()
    const user = model.define("user", {
      id: model.number(),
      username: model.text().defaultsTo("foo"),
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
        cascade: ["persist"],
        mappedBy: expect.any(Function),
        orphanRemoval: true,
      },
    })
  })

  test("define hasMany and hasOneThroughMany relationships", () => {
    const model = new EntityBuilder()
    const order = model.define("order", {
      amount: model.number(),
      user: model.hasOneThroughMany(() => user),
    })

    const user = model.define("user", {
      id: model.number(),
      username: model.text(),
      orders: model.hasMany(() => order),
    })

    const User = createMikrORMEntity(user)
    const Order = createMikrORMEntity(order)
    expectTypeOf(new User()).toMatchTypeOf<{
      id: number
      username: string
      orders: EntityConstructor<{
        amount: number
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
      orders: {
        reference: "1:m",
        name: "orders",
        cascade: ["persist"],
        mappedBy: expect.any(Function),
        orphanRemoval: true,
        entity: "Order",
      },
    })

    const orderMetaDdata = MetadataStorage.getMetadataFromDecorator(Order)
    expect(orderMetaDdata.className).toEqual("Order")
    expect(orderMetaDdata.path).toEqual("Order")
    expect(orderMetaDdata.properties).toEqual({
      amount: {
        reference: "scalar",
        type: "number",
        columnType: "integer",
        name: "amount",
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
        onDelete: "cascade",
        reference: "m:1",
      },
    })
  })

  test("define hasOne relationship on both sides", () => {
    const model = new EntityBuilder()
    const user = model.define("user", {
      id: model.number(),
      email: model.text(),
      profile: model.hasOne(() => profile),
    })

    const profile = model.define("profile", {
      id: model.number(),
      user_id: model.number(),
      user: model.hasOne(() => user),
    })

    const User = createMikrORMEntity(user)
    const Profile = createMikrORMEntity(profile)

    expectTypeOf(new User()).toMatchTypeOf<{
      id: number
      email: string
      profile: EntityConstructor<{
        id: number
        user_id: number
        user: EntityConstructor<{
          id: number
          email: string
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
      email: {
        reference: "scalar",
        type: "string",
        columnType: "text",
        name: "email",
        nullable: false,
        getter: false,
        setter: false,
      },
      profile: {
        name: "profile",
        cascade: ["persist"],
        entity: "Profile",
        nullable: false,
        onDelete: "cascade",
        owner: true,
        reference: "1:1",
      },
    })

    const profileMetadata = MetadataStorage.getMetadataFromDecorator(Profile)
    expect(profileMetadata.className).toEqual("Profile")
    expect(profileMetadata.path).toEqual("Profile")
    expect(profileMetadata.properties).toEqual({
      id: {
        reference: "scalar",
        type: "number",
        columnType: "integer",
        name: "id",
        nullable: false,
        getter: false,
        setter: false,
      },
      user: {
        cascade: ["persist"],
        entity: "User",
        name: "user",
        nullable: false,
        onDelete: "cascade",
        owner: true,
        reference: "1:1",
      },
      user_id: {
        columnType: "integer",
        getter: false,
        name: "user_id",
        nullable: false,
        reference: "scalar",
        setter: false,
        type: "number",
      },
    })
  })

  test("define manyToMany relationships", () => {
    const model = new EntityBuilder()
    const user = model.define("user", {
      id: model.number(),
      email: model.text(),
      books: model.manyToMany(() => book),
    })

    const book = model.define("book", {
      id: model.number(),
      title: model.text(),
      authors: model.manyToMany(() => user),
    })

    const User = createMikrORMEntity(user)
    const Book = createMikrORMEntity(book)

    expectTypeOf(new User()).toMatchTypeOf<{
      id: number
      email: string
      books: EntityConstructor<{
        id: number
        title: string
        authors: EntityConstructor<{
          id: number
          email: string
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
      email: {
        reference: "scalar",
        type: "string",
        columnType: "text",
        name: "email",
        nullable: false,
        getter: false,
        setter: false,
      },
      books: {
        name: "books",
        entity: "Book",
        mappedBy: expect.any(Function),
        reference: "m:n",
      },
    })

    const bookMetaData = MetadataStorage.getMetadataFromDecorator(Book)
    expect(bookMetaData.className).toEqual("Book")
    expect(bookMetaData.path).toEqual("Book")
    expect(bookMetaData.properties).toEqual({
      id: {
        reference: "scalar",
        type: "number",
        columnType: "integer",
        name: "id",
        nullable: false,
        getter: false,
        setter: false,
      },
      authors: {
        entity: "User",
        name: "authors",
        reference: "m:n",
        mappedBy: expect.any(Function),
      },
      title: {
        columnType: "text",
        getter: false,
        name: "title",
        nullable: false,
        reference: "scalar",
        setter: false,
        type: "string",
      },
    })
  })
})
