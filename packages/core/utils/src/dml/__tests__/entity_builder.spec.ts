import { expectTypeOf } from "expect-type"
import { MetadataStorage } from "@mikro-orm/core"
import { MikroORMEntity } from "../types"
import { EntityBuilder } from "../entity_builder"
import { createMikrORMEntity } from "../helpers/create_mikro_orm_entity"

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
        columnType: "number",
        name: "id",
        getter: false,
        setter: false,
      },
      username: {
        reference: "scalar",
        type: "string",
        columnType: "string",
        name: "username",
        getter: false,
        setter: false,
      },
      email: {
        reference: "scalar",
        type: "string",
        columnType: "string",
        name: "email",
        getter: false,
        setter: false,
      },
    })
  })

  test("define an entity with relationships", () => {
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
      emails: MikroORMEntity<{ email: string; isVerified: boolean }>
    }>()

    const metaData = MetadataStorage.getMetadataFromDecorator(User)
    expect(metaData.className).toEqual("User")
    expect(metaData.path).toEqual("User")
    expect(metaData.properties).toEqual({
      id: {
        reference: "scalar",
        type: "number",
        columnType: "number",
        name: "id",
        getter: false,
        setter: false,
      },
      username: {
        reference: "scalar",
        type: "string",
        columnType: "string",
        name: "username",
        getter: false,
        setter: false,
      },
      emails: {
        reference: "1:m",
        name: "emails",
        mappedBy: "",
        entity: "Email",
      },
    })
  })

  test("define an entity with recursive relationships", () => {
    const model = new EntityBuilder()
    const order = model.define("order", {
      amount: model.number(),
      user: model.hasOne(() => user),
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
      orders: MikroORMEntity<{
        amount: number
        user: MikroORMEntity<{
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
        columnType: "number",
        name: "id",
        getter: false,
        setter: false,
      },
      username: {
        reference: "scalar",
        type: "string",
        columnType: "string",
        name: "username",
        getter: false,
        setter: false,
      },
      orders: {
        reference: "1:m",
        name: "orders",
        mappedBy: "",
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
        columnType: "number",
        name: "amount",
        getter: false,
        setter: false,
      },
      user: {
        reference: "1:1",
        name: "user",
        mappedBy: "",
        entity: "User",
      },
    })
  })
})
