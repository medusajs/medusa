import { Entity, MikroORM, OnInit, Property } from "@mikro-orm/core"
import { BaseEntity } from "../base-entity"

describe("BaseEntity", () => {
  it("should handle the id generation using the provided prefix", async () => {
    @Entity()
    class Entity1 extends BaseEntity {
      constructor() {
        super({ prefix_id: "prod" })
      }
    }

    const orm = await MikroORM.init({
      entities: [Entity1],
      dbName: "test",
      type: "postgresql",
    })

    const manager = orm.em.fork()
    const entity1 = manager.create(Entity1, {})

    expect(entity1.id).toMatch(/prod_[0-9]/)

    await orm.close()
  })

  it("should handle the id generation without a provided prefix using the first three letter of the entity lower cased", async () => {
    @Entity()
    class Entity1 extends BaseEntity {}

    const orm = await MikroORM.init({
      entities: [Entity1],
      dbName: "test",
      type: "postgresql",
    })

    const manager = orm.em.fork()
    const entity1 = manager.create(Entity1, {})

    expect(entity1.id).toMatch(/ent_[0-9]/)

    await orm.close()
  })

  it("should handle the id generation without a provided prefix inferring it based on the words composing the entity name excluding model and entity as part of the name", async () => {
    @Entity()
    class ProductModel extends BaseEntity {}

    @Entity()
    class ProductCategoryEntity extends BaseEntity {}

    @Entity()
    class ProductOptionValue extends BaseEntity {}

    const orm = await MikroORM.init({
      entities: [ProductModel, ProductCategoryEntity, ProductOptionValue],
      dbName: "test",
      type: "postgresql",
    })

    const manager = orm.em.fork()

    const product = manager.create(ProductModel, {})
    const productCategory = manager.create(ProductCategoryEntity, {})
    const productOptionValue = manager.create(ProductOptionValue, {})

    expect(product.id).toMatch(/pro_[0-9]/)
    expect(productCategory.id).toMatch(/prc_[0-9]/)
    expect(productOptionValue.id).toMatch(/pov_[0-9]/)

    await orm.close()
  })

  it("should handle the id generation even with custom onInit or beforeCreate", async () => {
    @Entity()
    class ProductModel extends BaseEntity {
      @Property()
      custom_prop: string

      @OnInit()
      onInit() {
        this.custom_prop = "custom"
      }
    }

    @Entity()
    class ProductCategoryEntity extends BaseEntity {
      @Property()
      custom_prop: string

      @OnInit()
      onInit() {
        this.custom_prop = "custom"
      }
    }

    @Entity()
    class ProductOptionValue extends BaseEntity {
      @Property()
      custom_prop: string

      @OnInit()
      onInit() {
        this.custom_prop = "custom"
      }
    }

    const orm = await MikroORM.init({
      entities: [ProductModel, ProductCategoryEntity, ProductOptionValue],
      dbName: "test",
      type: "postgresql",
    })

    const manager = orm.em.fork()

    const product = manager.create(ProductModel, {})
    const productCategory = manager.create(ProductCategoryEntity, {})
    const productOptionValue = manager.create(ProductOptionValue, {})

    expect(product.id).toMatch(/pro_[0-9]/)
    expect(productCategory.id).toMatch(/prc_[0-9]/)
    expect(productOptionValue.id).toMatch(/pov_[0-9]/)

    expect(product.custom_prop).toBe("custom")
    expect(productCategory.custom_prop).toBe("custom")
    expect(productOptionValue.custom_prop).toBe("custom")

    await orm.close()
  })
})
