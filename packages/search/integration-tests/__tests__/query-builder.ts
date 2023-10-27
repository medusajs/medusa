import { ISearchModuleService } from "@medusajs/types"
import { Catalog, CatalogRelation } from "@models"
import { TestDatabase } from "../utils"
import { initModules } from "../utils/init-module"
import { EventBusService } from "../__fixtures__"

const eventBus = new EventBusService()
const remoteQueryMock = jest.fn()

jest.setTimeout(300000)

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  jest.clearAllMocks()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
}

describe("SearchEngineModuleService", function () {
  let module: ISearchModuleService

  beforeEach(async () => {
    const manager = await beforeEach_()

    module = await initModules({
      remoteQueryMock,
      eventBusMock: eventBus,
    })

    const catalogRepository = manager.getRepository(Catalog)

    await manager.persistAndFlush(
      [
        {
          id: "prod_1",
          name: "Product",
          data: {
            id: "prod_1",
          },
        },
        {
          id: "prod_2",
          name: "Product",
          data: {
            id: "prod_2",
            title: "Product 2 title",
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
          name: "MoneyAmount",
          data: {
            id: "money_amount_1",
            amount: 100,
          },
        },
        {
          id: "money_amount_2",
          name: "MoneyAmount",
          data: {
            id: "money_amount_2",
            amount: 10,
          },
        },
      ].map((data) => catalogRepository.create(data))
    )

    const catalogRelationRepository = manager.getRepository(CatalogRelation)

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
          child_name: "MoneyAmount",
          pivot: "PriceSet-MoneyAmount",
        },
        {
          parent_id: "price_set_2",
          parent_name: "PriceSet",
          child_id: "money_amount_2",
          child_name: "MoneyAmount",
          pivot: "PriceSet-MoneyAmount",
        },
      ].map((data) => catalogRelationRepository.create(data))
    )

    manager.clear()
  })

  afterEach(afterEach_)

  it("should query all products", async () => {
    const [result, count] = await module.queryAndCount(
      {
        select: {
          product: {
            variants: {
              money_amounts: true,
            },
          },
        },
      },
      {
        orderBy: [{ "product.variants.sku": "DESC" }],
      }
    )

    expect(count).toEqual(2)
    expect(result).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        variants: [],
      },
      {
        id: "prod_1",
        variants: [
          {
            id: "var_2",
            sku: "sku 123",
            money_amounts: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },

          {
            id: "var_1",
            sku: "aaa test aaa",
            money_amounts: [
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

  it("should query products filtering by variant sku", async () => {
    const result = await module.query({
      select: {
        product: {
          variants: {
            money_amounts: true,
          },
        },
      },
      where: {
        "product.variants.sku": { $like: "aaa%" },
      },
    })

    expect(result).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            money_amounts: [
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

  it("should query products filtering by money amount and returning the complete entity", async () => {
    const [result] = await module.queryAndCount(
      {
        select: {
          product: {
            variants: {
              money_amounts: true,
            },
          },
        },
        where: {
          "product.variants.money_amounts.amount": { $gt: "50" },
        },
      },
      {
        keepFilteredEntities: true,
      }
    )
    expect(result).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            money_amounts: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
          {
            id: "var_2",
            sku: "sku 123",
            money_amounts: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query all products", async () => {
    const [result, count] = await module.queryAndCount({
      select: {
        product: {
          variants: {
            money_amounts: true,
          },
        },
      },
    })

    expect(count).toEqual(2)
    expect(result).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            money_amounts: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
          {
            id: "var_2",
            sku: "sku 123",
            money_amounts: [
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
        variants: [],
      },
    ])
  })

  it("should paginate products", async () => {
    const result = await module.query(
      {
        select: {
          product: {
            variants: {
              money_amounts: true,
            },
          },
        },
      },
      {
        take: 1,
        skip: 1,
      }
    )

    expect(result).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        variants: [],
      },
    ])
  })

  it("should handle null values on where clause", async () => {
    const result = await module.query({
      select: {
        product: {
          variants: {
            money_amounts: true,
          },
        },
      },
      where: {
        "product.variants.sku": null,
      },
    })

    expect(result).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        variants: [],
      },
    ])
  })
})
