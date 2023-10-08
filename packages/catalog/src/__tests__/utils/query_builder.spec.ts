import { QueryBuilder } from "../../utils/query-builder"

describe("Catalog Query Builder", function () {
  it("Should create a simple object from a resultset", async function () {
    const qb = new QueryBuilder()

    const input = {
      product: {
        entity: "Product",
      },
    }
    const rs = [
      {
        product: '{"title": "product 1", "handler": "product_1"}',
        "product.id": "prod_1",
      },
      {
        product: '{"title": "product 2", "handler": "product_2"}',
        "product.id": "prod_2",
      },
      {
        product: '{"title": "product 3", "handler": "product_3"}',
        "product.id": "prod_3",
      },
    ]

    const obj = qb.buildObjectFromResultset(rs, input)

    expect(obj).toEqual([
      {
        title: "product 1",
        handler: "product_1",
      },
      {
        title: "product 2",
        handler: "product_2",
      },
      {
        title: "product 3",
        handler: "product_3",
      },
    ])
  })

  it("Should create a nested object from a resultset", async function () {
    const qb = new QueryBuilder()

    const input = {
      product: {
        entity: "Product",
        variants: {
          entity: "ProductVariant",
        },
      },
    }
    const rs = [
      {
        product: '{"title": "product 1", "handler": "product_1"}',
        "product.id": "prod_1",
        "product.variants": '{"sku": "varvar333"}',
        "product.variants.id": "var_3",
      },
      {
        product: '{"title": "product 2", "handler": "product_2"}',
        "product.id": "prod_2",
        "product.variants": '{"sku": "varvar222"}',
        "product.variants.id": "var_2",
      },
      {
        product: '{"title": "product 3", "handler": "product_3"}',
        "product.id": "prod_3",
        "product.variants": '{"sku": "varvar111"}',
        "product.variants.id": "var_1",
      },
    ]

    const obj = qb.buildObjectFromResultset(rs, input)

    expect(obj).toEqual([
      {
        title: "product 1",
        handler: "product_1",
        variants: [
          {
            sku: "varvar333",
          },
        ],
      },
      {
        title: "product 2",
        handler: "product_2",
        variants: [
          {
            sku: "varvar222",
          },
        ],
      },
      {
        title: "product 3",
        handler: "product_3",
        variants: [
          {
            sku: "varvar111",
          },
        ],
      },
    ])
  })

  it("Should create a complex nested object from a resultset including repeated references", async function () {
    const qb = new QueryBuilder()

    const input = {
      product: {
        entity: "Product",
        variants: {
          entity: "ProductVariant",
          options: {
            entity: "ProductVariantOption",
            value: {
              entity: "ProductOptionValue",
            },
          },
        },
        sales_channels: {
          entity: "SalesChannel",
        },
      },
    }
    const rs = [
      {
        product: '{"title": "product 1", "handler": "product_1"}',
        "product.id": "prod_1",
        "product.variants": '{"sku": "varvar333"}',
        "product.variants.id": "var_3",
        "product.variants.options": '{"name": "Voltage"}',
        "product.variants.options.id": "opt_3",
        "product.variants.options.value": '"127V"',
        "product.variants.options.value.id": "value_1",
        "product.sales_channels": '{"name": "Default Sales Channel"}',
        "product.sales_channels.id": "sc_1",
      },
      {
        product: '{"title": "product 1", "handler": "product_1"}',
        "product.id": "prod_1",
        "product.variants": '{"sku": "varvar333"}',
        "product.variants.id": "var_3",
        "product.variants.options": '{"name": "Voltage"}',
        "product.variants.options.id": "opt_3",
        "product.variants.options.value": '"127V"',
        "product.variants.options.value.id": "value_1",
        "product.sales_channels": '{"name": "Street store"}',
        "product.sales_channels.id": "sc_2",
      },
      {
        product: '{"title": "product 2", "handler": "product_2"}',
        "product.id": "prod_2",
        "product.variants": '{"sku": "varvar222"}',
        "product.variants.id": "var_2",
        "product.variants.options": null,
        "product.variants.options.id": null,
        "product.variants.options.value": null,
        "product.variants.options.value.id": null,
        "product.sales_channels": '{"name": "Default channel"}',
        "product.sales_channels.id": "sc_1",
      },
      {
        product: '{"title": "product 3", "handler": "product_3"}',
        "product.id": "prod_3",
        "product.variants": '{"sku": "varvar111"}',
        "product.variants.id": "var_1",
        "product.variants.options": '{"name": "Voltage"}',
        "product.variants.options.id": "opt_3",
        "product.variants.options.value": '"127V"',
        "product.variants.options.value.id": "value_1",
        "product.sales_channels": null,
        "product.sales_channels.id": null,
      },
    ]

    const obj = qb.buildObjectFromResultset(rs, input)

    expect(obj).toEqual([
      {
        title: "product 1",
        handler: "product_1",
        variants: [
          {
            sku: "varvar333",
            options: [
              {
                name: "Voltage",
                value: ["127V"],
              },
            ],
          },
        ],
        sales_channels: [
          {
            name: "Default Sales Channel",
          },
          {
            name: "Street store",
          },
        ],
      },
      {
        title: "product 2",
        handler: "product_2",
        variants: [
          {
            sku: "varvar222",
            options: [],
          },
        ],
        sales_channels: [
          {
            name: "Default channel",
          },
        ],
      },
      {
        title: "product 3",
        handler: "product_3",
        variants: [
          {
            sku: "varvar111",
            options: [
              {
                name: "Voltage",
                value: ["127V"],
              },
            ],
          },
        ],
        sales_channels: [],
      },
    ])
  })
})
