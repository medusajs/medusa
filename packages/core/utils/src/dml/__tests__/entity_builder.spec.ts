import { expectTypeOf } from "expect-type"
import { Infer, MikroORMEntity } from "../types"
import { EntityBuilder } from "../entity_builder"

describe("Entity builder", () => {
  test("define an entity", () => {
    const model = new EntityBuilder()
    const user = model.define("user", {
      id: model.number(),
      username: model.string(),
      email: model.string(),
    })

    expectTypeOf<InstanceType<Infer<typeof user>>>().toMatchTypeOf<{
      id: number
      username: string
      email: string
    }>()
  })

  test("define an entity with relationships", () => {
    const model = new EntityBuilder()
    const email = model.define("email", {
      email: model.string(),
      isVerified: model.boolean(),
    })

    const user = model.define("user", {
      id: model.number(),
      username: model.string(),
      emails: model.hasMany(() => email),
    })

    expectTypeOf<InstanceType<Infer<typeof user>>>().toEqualTypeOf<{
      id: number
      username: string
      emails: MikroORMEntity<{ email: string; isVerified: boolean }>
    }>()
  })

  test("define an entity with recursive relationships", () => {
    const model = new EntityBuilder()
    const order = model.define("order", {
      amount: model.number(),
      user: model.hasOne(() => user),
    })

    const user = model.define("user", {
      id: model.number(),
      username: model.string(),
      orders: model.hasMany(() => order),
    })

    expectTypeOf<InstanceType<Infer<typeof user>>>().toMatchTypeOf<{
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
  })
})
