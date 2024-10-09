import { MikroORM } from "@mikro-orm/core"
import {
  Entity1WithUnDecoratedProp,
  Entity2WithUnDecoratedProp,
  Product,
  ProductOption,
  ProductOptionValue,
  ProductVariant,
} from "../__fixtures__/utils"
import { mikroOrmSerializer } from "../mikro-orm-serializer"

describe("mikroOrmSerializer", () => {
  beforeEach(async () => {
    await MikroORM.init({
      entities: [
        Entity1WithUnDecoratedProp,
        Entity2WithUnDecoratedProp,
        Product,
        ProductOption,
        ProductOptionValue,
        ProductVariant,
      ],
      dbName: "test",
      type: "postgresql",
    })
  })

  it("should serialize an entity", async () => {
    const entity1 = new Entity1WithUnDecoratedProp({
      id: "1",
      deleted_at: null,
    })
    entity1.unknownProp = "calculated"

    const entity2 = new Entity2WithUnDecoratedProp({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = await mikroOrmSerializer(entity1, {
      preventCircularRef: false,
    })

    expect(serialized).toEqual({
      id: "1",
      deleted_at: null,
      unknownProp: "calculated",
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1: {
            id: "1",
            deleted_at: null,
            unknownProp: "calculated",
          },
          entity1_id: "1",
        },
      ],
    })
  })

  it("should serialize an array of entities", async () => {
    const entity1 = new Entity1WithUnDecoratedProp({
      id: "1",
      deleted_at: null,
    })
    entity1.unknownProp = "calculated"

    const entity2 = new Entity2WithUnDecoratedProp({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = await mikroOrmSerializer([entity1, entity1], {
      preventCircularRef: false,
    })

    const expectation = {
      id: "1",
      deleted_at: null,
      unknownProp: "calculated",
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1: {
            id: "1",
            deleted_at: null,
            unknownProp: "calculated",
          },
          entity1_id: "1",
        },
      ],
    }

    expect(serialized).toEqual([expectation, expectation])
  })

  it("should serialize an entity preventing circular relation reference", async () => {
    const entity1 = new Entity1WithUnDecoratedProp({
      id: "1",
      deleted_at: null,
    })
    entity1.unknownProp = "calculated"

    const entity2 = new Entity2WithUnDecoratedProp({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = await mikroOrmSerializer(entity1)

    expect(serialized).toEqual({
      id: "1",
      deleted_at: null,
      unknownProp: "calculated",
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1_id: "1",
        },
      ],
    })
  })

  it(`should properly serialize nested relations and sibling to not return parents into children`, async () => {
    const productOptionValue = new ProductOptionValue()
    productOptionValue.id = "1"
    productOptionValue.name = "Product option value 1"
    productOptionValue.option_id = "1"

    const productOptions = new ProductOption()
    productOptions.id = "1"
    productOptions.name = "Product option 1"
    productOptions.values.add(productOptionValue)

    const productVariant = new ProductVariant()
    productVariant.id = "1"
    productVariant.name = "Product variant 1"
    productVariant.options.add(productOptionValue)

    const product = new Product()
    product.id = "1"
    product.name = "Product 1"
    product.options.add(productOptions)
    product.variants.add(productVariant)

    const serialized = await mikroOrmSerializer(product)

    expect(serialized).toEqual({
      id: "1",
      options: [
        {
          id: "1",
          values: [
            {
              id: "1",
              variants: [
                {
                  id: "1",
                  name: "Product variant 1",
                },
              ],
              name: "Product option value 1",
              option_id: "1",
            },
          ],
          name: "Product option 1",
        },
      ],
      variants: [
        {
          id: "1",
          options: [
            {
              id: "1",
              name: "Product option value 1",
              option_id: "1",
              option: {
                id: "1",
                name: "Product option 1",
              },
            },
          ],
          name: "Product variant 1",
        },
      ],
      name: "Product 1",
    })
  })
})
