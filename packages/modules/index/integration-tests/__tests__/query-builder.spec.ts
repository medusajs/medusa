import { SqlEntityManager } from "@medusajs/framework/mikro-orm/postgresql"
import { IndexTypes } from "@medusajs/framework/types"
import { toMikroORMEntity } from "@medusajs/framework/utils"
import { IndexData, IndexRelation } from "@models"
import {
  createIndexTestBed,
  IndexModuleTestBed,
  schema,
} from "../__fixtures__"

jest.setTimeout(300000)

const seedIndexData = async (manager: SqlEntityManager) => {
  const indexRepository = manager.getRepository(toMikroORMEntity(IndexData))

  await manager.persistAndFlush(
    [
      {
        id: "prod_1",
        name: "Product",
        data: {
          id: "prod_1",
          title: "Product 1",
        },
      },
      {
        id: "prod_2",
        name: "Product",
        data: {
          id: "prod_2",
          title: "Product 2 title",
          deep: {
            a: 1,
            obj: {
              b: 15,
            },
          },
        },
      },
      {
        id: "var_1",
        name: "ProductVariant",
        data: {
          id: "var_1",
          sku: "aaa test aaa",
        },
      },
      {
        id: "var_2",
        name: "ProductVariant",
        data: {
          id: "var_2",
          sku: "sku 123",
        },
      },
      {
        id: "link_id_1",
        name: "LinkProductVariantPriceSet",
        data: {
          id: "link_id_1",
          variant_id: "var_1",
          price_set_id: "price_set_1",
        },
      },
      {
        id: "link_id_2",
        name: "LinkProductVariantPriceSet",
        data: {
          id: "link_id_2",
          variant_id: "var_2",
          price_set_id: "price_set_2",
        },
      },
      {
        id: "price_set_1",
        name: "PriceSet",
        data: {
          id: "price_set_1",
        },
      },
      {
        id: "price_set_2",
        name: "PriceSet",
        data: {
          id: "price_set_2",
        },
      },
      {
        id: "money_amount_1",
        name: "Price",
        data: {
          id: "money_amount_1",
          amount: 100,
        },
      },
      {
        id: "money_amount_2",
        name: "Price",
        data: {
          id: "money_amount_2",
          amount: 10,
        },
      },
    ].map((data) => indexRepository.create(data))
  )

  const indexRelationRepository = manager.getRepository(
    toMikroORMEntity(IndexRelation)
  )

  await manager.persistAndFlush(
    [
      {
        parent_id: "prod_1",
        parent_name: "Product",
        child_id: "var_1",
        child_name: "ProductVariant",
        pivot: "Product-ProductVariant",
      },
      {
        parent_id: "prod_1",
        parent_name: "Product",
        child_id: "var_2",
        child_name: "ProductVariant",
        pivot: "Product-ProductVariant",
      },
      {
        parent_id: "var_1",
        parent_name: "ProductVariant",
        child_id: "link_id_1",
        child_name: "LinkProductVariantPriceSet",
        pivot: "ProductVariant-LinkProductVariantPriceSet",
      },
      {
        parent_id: "var_2",
        parent_name: "ProductVariant",
        child_id: "link_id_2",
        child_name: "LinkProductVariantPriceSet",
        pivot: "ProductVariant-LinkProductVariantPriceSet",
      },
      {
        parent_id: "link_id_1",
        parent_name: "LinkProductVariantPriceSet",
        child_id: "price_set_1",
        child_name: "PriceSet",
        pivot: "LinkProductVariantPriceSet-PriceSet",
      },
      {
        parent_id: "link_id_2",
        parent_name: "LinkProductVariantPriceSet",
        child_id: "price_set_2",
        child_name: "PriceSet",
        pivot: "LinkProductVariantPriceSet-PriceSet",
      },
      {
        parent_id: "price_set_1",
        parent_name: "PriceSet",
        child_id: "money_amount_1",
        child_name: "Price",
        pivot: "PriceSet-Price",
      },
      {
        parent_id: "price_set_2",
        parent_name: "PriceSet",
        child_id: "money_amount_2",
        child_name: "Price",
        pivot: "PriceSet-Price",
      },
    ].map((data) => indexRelationRepository.create(data))
  )
}

describe("IndexModuleService query", function () {
  let testBed: IndexModuleTestBed
  let module: IndexTypes.IIndexService

  beforeAll(async () => {
    testBed = await createIndexTestBed({ schema })
    module = testBed.module
  })

  afterAll(async () => {
    await testBed.teardown()
  })

  beforeEach(async () => {
    await testBed.truncateTables()
    await seedIndexData(testBed.forkManager())
  })

  it("should query all products where sku not null", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      filters: {
        product: {
          variants: {
            sku: { $ne: null },
          },
        },
      },
    })

    const { data: dataNot } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      filters: {
        product: {
          variants: {
            sku: {
              $not: {
                $eq: null,
              },
            },
          },
        },
      },
    })

    expect(data.length).toEqual(1)
    expect(dataNot.length).toEqual(1)
    expect(dataNot).toEqual(data)

    const { data: data2 } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      filters: {
        product: {
          variants: {
            sku: { $eq: null },
          },
        },
      },
    })

    expect(data2.length).toEqual(0)
  })

  it("should query all products ordered by sku DESC", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      pagination: {
        order: {
          product: {
            variants: {
              sku: "DESC",
            },
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
      {
        id: "prod_1",
        title: "Product 1",
        variants: [
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },

          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query all products ordered by sku DESC with specific fields", async () => {
    const { data } = await module.query({
      fields: [
        "product.*",
        "product.variants.sku",
        "product.variants.prices.amount",
      ],
      pagination: {
        order: {
          product: {
            variants: {
              sku: "DESC",
            },
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
      {
        id: "prod_1",
        title: "Product 1",
        variants: [
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },

          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query all products ordered by price", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      pagination: {
        order: {
          product: {
            variants: {
              prices: {
                amount: "DESC",
              },
            },
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
      {
        id: "prod_1",
        title: "Product 1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },
        ],
      },
    ])

    const { data: dataAsc } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      pagination: {
        order: {
          product: {
            variants: {
              prices: {
                amount: "ASC",
              },
            },
          },
        },
      },
    })

    expect(dataAsc).toEqual([
      {
        id: "prod_1",
        title: "Product 1",
        variants: [
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
        ],
      },
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
    ])
  })

  it("should query all products ordered by price returning only ids", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*"],
      idsOnly: true,
      pagination: {
        order: {
          product: {
            variants: {
              prices: {
                amount: "DESC",
              },
            },
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_2",
        variants: [],
      },
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
          },
          {
            id: "var_2",
          },
        ],
      },
    ])
  })

  it("should query products filtering by variant sku", async () => {
    const { data, metadata } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      filters: {
        product: {
          variants: {
            sku: { $like: "aaa%" },
          },
        },
      },
      pagination: {
        take: 100,
        skip: 0,
      },
    })

    expect(metadata).toEqual({
      estimate_count: expect.any(Number),
      skip: 0,
      take: 100,
    })

    expect(data).toEqual([
      {
        id: "prod_1",
        title: "Product 1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query products filtering by variant sku and join filters on prices amount", async () => {
    const { data, metadata } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      joinFilters: {
        "product.variants.prices.amount": { $gt: 110 },
      },
      filters: {
        product: {
          variants: {
            sku: { $like: "aaa%" },
          },
        },
      },
      pagination: {
        take: 100,
        skip: 0,
        order: {
          product: {
            created_at: "ASC",
          },
        },
      },
    })

    expect(metadata).toEqual({
      estimate_count: expect.any(Number),
      skip: 0,
      take: 100,
    })

    expect(data).toEqual([
      {
        id: "prod_1",
        title: "Product 1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [],
          },
        ],
      },
    ])
  })

  it("should filter using fields not selected", async () => {
    const { data } = await module.query({
      fields: ["product.id", "product.variants.*"],
      pagination: {
        order: {
          product: {
            variants: {
              prices: {
                amount: "ASC",
              },
            },
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_2",
            sku: "sku 123",
          },
          {
            id: "var_1",
            sku: "aaa test aaa",
          },
        ],
      },
      {
        id: "prod_2",
        variants: [],
      },
    ])
  })

  it("should filter using IN operator with array of strings", async () => {
    const { data } = await module.query({
      fields: ["product.id", "product.variants.*"],
      filters: {
        product: {
          variants: {
            sku: { $in: ["sku 123", "aaa test aaa", "does-not-exist"] },
          },
        },
      },
      pagination: {
        order: {
          product: {
            variants: {
              prices: {
                amount: "DESC",
              },
            },
          },
        },
      },
    })

    expect(data).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
          },
          {
            id: "var_2",
            sku: "sku 123",
          },
        ],
      },
    ])
  })

  it("should query all products", async () => {
    const { data } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
    })

    expect(data).toEqual([
      {
        id: "prod_1",
        title: "Product 1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },
        ],
      },
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
    ])
  })

  it("should paginate products", async () => {
    const { data, metadata } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      pagination: {
        take: 1,
        skip: 1,
        order: {
          product: {
            id: "ASC",
          },
        },
      },
    })

    expect(metadata).toEqual({
      estimate_count: expect.any(Number),
      skip: 1,
      take: 1,
    })
    expect(data).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
    ])
  })

  it("should query products filtering by deep nested levels", async () => {
    const { data, metadata } = await module.query({
      fields: ["product.*"],
      filters: {
        product: {
          deep: {
            obj: {
              b: 15,
            },
          },
        },
      },
      pagination: {
        take: 1,
        skip: 0,
      },
    })

    expect(metadata).toEqual({
      estimate_count: expect.any(Number),
      skip: 0,
      take: 1,
    })
    expect(data).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
      },
    ])
  })

  it("should query products filtering by prices bigger than 20", async () => {
    const { data, metadata } = await module.query({
      fields: ["product.*", "product.variants.*", "product.variants.prices.*"],
      filters: {
        product: {
          variants: {
            prices: {
              amount: { $gt: 20 },
            },
          },
        },
      },
      pagination: {
        take: 100,
        skip: 0,
        order: {
          product: {
            created_at: "ASC",
          },
        },
      },
    })

    expect(metadata).toEqual({
      estimate_count: expect.any(Number),
      skip: 0,
      take: 100,
    })

    expect(data).toEqual([
      {
        id: "prod_1",
        title: "Product 1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query products filtering product not in [X]", async () => {
    const expected = [
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
      },
    ]

    const { data } = await module.query({
      fields: ["product.*"],
      filters: {
        product: {
          $not: [
            {
              id: {
                $in: ["prod_1"],
              },
            },
          ],
        },
      },
    })
    expect(data).toEqual(expected)
  })

  it("should query products filtering product not in [X] using $nin", async () => {
    const expected = [
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
      },
    ]

    const { data } = await module.query({
      fields: ["product.*"],
      filters: {
        product: {
          id: {
            $nin: ["prod_1"],
          },
        },
      },
    })
    expect(data).toEqual(expected)
  })

  it("should query products with variants.sku not in [X] and title eq", async () => {
    const expected = [
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
      },
    ]

    const { data } = await module.query({
      fields: ["product.*", "variants.*"],
      filters: {
        product: {
          variants: {
            sku: {
              $nin: ["sku 123"],
            },
          },
          title: {
            $eq: "Product 2 title",
          },
        },
      },
    })
    expect(data).toEqual(expected)
  })

  it("should query products filtering title like and not equal specific value", async () => {
    const expected = [
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
      },
    ]

    const { data } = await module.query({
      fields: ["product.*"],
      filters: {
        product: {
          $and: [
            {
              title: {
                $like: "Product%",
              },
            },
            {
              $not: {
                title: {
                  $eq: "Product 1",
                },
              },
            },
          ],
        },
      },
    })
    expect(data).toEqual(expected)
  })

  it("should query products filtering title using $ilike", async () => {
    const expected = [
      {
        id: "prod_2",
        title: "Product 2 title",
      },
    ]

    const { data } = await module.query({
      fields: ["product.id", "product.title"],
      filters: {
        product: {
          title: {
            $ilike: "PROdUCt 2%",
          },
        },
      },
    })
    expect(data).toEqual(expected)

    const { data: sensitive } = await module.query({
      fields: ["product.id", "product.title"],
      filters: {
        product: {
          title: {
            $like: "PROdUCt 2%",
          },
        },
      },
    })
    expect(sensitive).toEqual([])
  })

  describe("special characters in @> containment filter values", () => {
    const injectionPayloads = [
      "'",
      "'; SELECT pg_sleep(0)--",
      "' OR 1=1--",
      `\\' OR 1=1--`,
    ]

    it.each(injectionPayloads)(
      "does not error and returns no matches for direct equality with payload: %s",
      async (payload) => {
        const { data } = await module.query({
          fields: ["product.id", "product.title"],
          filters: {
            product: {
              title: payload,
            },
          },
        })

        expect(data).toEqual([])
      }
    )

    it.each(injectionPayloads)(
      "does not error and returns no matches for $eq operator with payload: %s",
      async (payload) => {
        const { data } = await module.query({
          fields: ["product.id", "product.title"],
          filters: {
            product: {
              title: { $eq: payload },
            },
          },
        })

        expect(data).toEqual([])
      }
    )

    it("matches a literal title containing a single quote", async () => {
      const manager = testBed.forkManager()

      const indexRepository = manager.getRepository(toMikroORMEntity(IndexData))
      await manager.persistAndFlush(
        indexRepository.create({
          id: "prod_quote",
          name: "Product",
          data: {
            id: "prod_quote",
            title: "O'Reilly's Book",
          },
        })
      )

      const { data } = await module.query({
        fields: ["product.id", "product.title"],
        filters: {
          product: {
            title: "O'Reilly's Book",
          },
        },
      })

      expect(data).toEqual([{ id: "prod_quote", title: "O'Reilly's Book" }])
    })
  })
})
