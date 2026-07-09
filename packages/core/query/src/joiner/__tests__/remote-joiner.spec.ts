import { IModuleService, MedusaContainer } from "@medusajs/types"
import { lowerCaseFirst, toPascalCase } from "@medusajs/utils"
import { IRemoteDataFetcher, RemoteExpandProperty, RemoteJoiner } from ".."
import {
  createFulfillmentLocationCatalog,
  fulfillmentLocationDataFetcher,
  fulfillmentLocationJoinerConfigs,
  shippingOptionLocationQuery,
} from "../__fixtures__/fulfillment-location"
import { serviceConfigs, serviceMock } from "../__mocks__/mock_data"
import { compileQuery } from "../compile"
import { filterFields } from "../execute"

const container = {
  resolve: (serviceName) => {
    return {
      list: (...args) => {
        return serviceMock[serviceName].apply(this, args)
      },
      getByProductId: (...args) => {
        return serviceMock[serviceName].apply(this, args)
      },
    }
  },
} as MedusaContainer

const fetchServiceDataCallback = async (
  expand: RemoteExpandProperty,
  pkField: string,
  ids?: (unknown | unknown[])[],
  relationship?: any
) => {
  const serviceConfig = expand.serviceConfig
  const moduleRegistryName =
    lowerCaseFirst(serviceConfig.serviceName) + "Service"

  const service: IModuleService = container.resolve(moduleRegistryName)
  const methodName = relationship?.inverse
    ? `getBy${toPascalCase(pkField)}`
    : "list"

  return await service[methodName]({
    fields: expand.fields,
    args: expand.args,
    expands: expand.expands,
    options: {
      [pkField]: ids,
    },
  })
}

const dataFetcher: IRemoteDataFetcher = {
  fetch: fetchServiceDataCallback,
}

describe("RemoteJoiner", () => {
  let joiner: RemoteJoiner

  beforeAll(() => {
    joiner = new RemoteJoiner(serviceConfigs, dataFetcher)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should filter the fields and attach the values correctly", () => {
    const data = {
      id: "prod_01H1PN579TJ707BRK938E2ME2N",
      title: "7468915",
      handle: "7468915",
      subtitle: null,
      description: null,
      collection_id: null,
      collection: null,
      type_id: "ptyp_01GX66TMARS55DBNYE31DDT8ZV",
      type: {
        id: "ptyp_01GX66TMARS55DBNYE31DDT8ZV",
        value: "test-type-1",
      },
      options: [
        {
          id: "opt_01H1PN57AQE8G3FK365EYNH917",
          title: "4108194",
          product_id: "prod_01H1PN579TJ707BRK938E2ME2N",
          product: "prod_01H1PN579TJ707BRK938E2ME2N",
          values: [
            {
              id: "optval_01H1PN57EAMXYFRGSJJJE9P0TJ",
              value: "4108194",
              option_id: "opt_01H1PN57AQE8G3FK365EYNH917",
              option: "opt_01H1PN57AQE8G3FK365EYNH917",
              variant_id: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
              variant: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
            },
          ],
        },
      ],
      variants: [
        {
          id: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
          product_id: "prod_01H1PN579TJ707BRK938E2ME2N",
          product: "prod_01H1PN579TJ707BRK938E2ME2N",
          options: [
            {
              id: "optval_01H1PN57EAMXYFRGSJJJE9P0TJ",
              value: "4108194",
              option_id: "opt_01H1PN57AQE8G3FK365EYNH917",
              option: "opt_01H1PN57AQE8G3FK365EYNH917",
              variant_id: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
              variant: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
            },
          ],
        },
      ],
      tags: [],
      images: [],
    }

    const fields = [
      "id",
      "title",
      "subtitle",
      "description",
      "handle",
      "images",
      "tags",
      "type",
      "collection",
      "options",
      "variants_id",
    ]

    const expands = {
      collection: {
        fields: ["id", "title", "handle"],
      },
      images: {
        fields: ["url"],
      },
      options: {
        fields: ["title", "values"],
        expands: {
          values: {
            fields: ["id", "value"],
          },
        },
      },
      tags: {
        fields: ["value"],
      },
      type: {
        fields: ["value"],
      },
      variants: {
        fields: ["id", "options"],
        expands: {
          options: {
            fields: ["id", "value"],
          },
        },
      },
    }

    const filteredFields = filterFields(data, fields, expands)

    expect(filteredFields).toEqual(
      expect.objectContaining({
        id: "prod_01H1PN579TJ707BRK938E2ME2N",
        title: "7468915",
        subtitle: null,
        description: null,
        handle: "7468915",
        images: [],
        tags: [],
        type: {
          value: "test-type-1",
        },
        collection: null,
        options: [
          {
            title: "4108194",
            values: [
              {
                id: "optval_01H1PN57EAMXYFRGSJJJE9P0TJ",
                value: "4108194",
              },
            ],
          },
        ],
        variants: [
          {
            id: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
            options: [
              {
                id: "optval_01H1PN57EAMXYFRGSJJJE9P0TJ",
                value: "4108194",
              },
            ],
          },
        ],
      })
    )
  })

  it("should filter the fields and attach the values correctly taking into account the * fields selection", () => {
    const data = {
      id: "prod_01H1PN579TJ707BRK938E2ME2N",
      title: "7468915",
      handle: "7468915",
      subtitle: null,
      description: null,
      collection_id: null,
      collection: null,
      type_id: "ptyp_01GX66TMARS55DBNYE31DDT8ZV",
      type: {
        id: "ptyp_01GX66TMARS55DBNYE31DDT8ZV",
        value: "test-type-1",
      },
      options: [
        {
          id: "opt_01H1PN57AQE8G3FK365EYNH917",
          title: "4108194",
          product_id: "prod_01H1PN579TJ707BRK938E2ME2N",
          product: "prod_01H1PN579TJ707BRK938E2ME2N",
          values: [
            {
              id: "optval_01H1PN57EAMXYFRGSJJJE9P0TJ",
              value: "4108194",
              option_id: "opt_01H1PN57AQE8G3FK365EYNH917",
              option: "opt_01H1PN57AQE8G3FK365EYNH917",
              variant_id: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
              variant: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
            },
          ],
        },
      ],
      variants: [
        {
          id: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
          product_id: "prod_01H1PN579TJ707BRK938E2ME2N",
          product: "prod_01H1PN579TJ707BRK938E2ME2N",
          options: [
            {
              id: "optval_01H1PN57EAMXYFRGSJJJE9P0TJ",
              value: "4108194",
              option_id: "opt_01H1PN57AQE8G3FK365EYNH917",
              option: "opt_01H1PN57AQE8G3FK365EYNH917",
              variant_id: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
              variant: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
            },
          ],
        },
      ],
      tags: [],
      images: [],
    }

    const fields = [
      "id",
      "title",
      "subtitle",
      "description",
      "handle",
      "images",
      "tags",
      "type",
      "collection",
      "options",
      "variants_id",
    ]

    const expands = {
      collection: {
        fields: ["id", "title", "handle"],
      },
      images: {
        fields: ["url"],
      },
      options: {
        fields: ["title", "values"],
        expands: {
          values: {
            fields: ["id", "value"],
          },
        },
      },
      tags: {
        fields: ["value"],
      },
      type: {
        fields: ["value"],
      },
      variants: {
        fields: ["*"],
        expands: {
          options: {
            fields: ["id", "value"],
          },
        },
      },
    }

    const filteredFields = filterFields(data, fields, expands)

    expect(filteredFields).toEqual(
      expect.objectContaining({
        id: "prod_01H1PN579TJ707BRK938E2ME2N",
        title: "7468915",
        subtitle: null,
        description: null,
        handle: "7468915",
        images: [],
        tags: [],
        type: {
          value: "test-type-1",
        },
        collection: null,
        options: [
          {
            title: "4108194",
            values: [
              {
                id: "optval_01H1PN57EAMXYFRGSJJJE9P0TJ",
                value: "4108194",
              },
            ],
          },
        ],
        variants: [
          {
            id: "variant_01H1PN57E99TMZAGNEZBSS3FM3",
            product_id: "prod_01H1PN579TJ707BRK938E2ME2N",
            product: "prod_01H1PN579TJ707BRK938E2ME2N",
            options: [
              {
                id: "optval_01H1PN57EAMXYFRGSJJJE9P0TJ",
                value: "4108194",
              },
            ],
          },
        ],
      })
    )
  })

  it("Simple query of a service, its id and no fields specified", async () => {
    const query = {
      service: "user",
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      fields: ["id", "name", "email"],
    }

    await joiner.query(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      fields: ["id", "name", "email"],
      options: { id: ["1"] },
    })
  })

  it("Simple query of a service by its alias", async () => {
    const query = {
      alias: "customer",
      fields: ["id"],
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
    }

    await joiner.query(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      fields: ["id"],
      options: { id: ["1"] },
    })
  })

  it("Simple query of a service by its alias with extra arguments", async () => {
    const query = {
      alias: "me",
      fields: ["id"],
      args: [
        {
          name: "id",
          value: 1,
        },
        {
          name: "arg1",
          value: "abc",
        },
      ],
    }

    await joiner.query(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      args: [
        {
          name: "arg1",
          value: "abc",
        },
      ],
      fields: ["id"],
      options: { id: [1] },
    })
  })

  it("Simple query of a service, its id and a few fields specified", async () => {
    const query = {
      service: "user",
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      fields: ["username", "email"],
    }

    await joiner.query(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      fields: ["username", "email"],
      options: { id: ["1"] },
    })
  })

  it("Query of a service, expanding a property and restricting the fields expanded", async () => {
    const query = {
      service: "user",
      fields: ["username", "email", "products"],
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      expands: [
        {
          property: "products",
          fields: ["product"],
        },
        {
          property: "products.product",
          fields: ["name"],
        },
      ],
    }

    await joiner.query(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      fields: ["username", "email", "products"],
      expands: {
        products: {
          args: undefined,
          fields: ["product_id"],
        },
      },
      options: { id: ["1"] },
    })

    expect(serviceMock.productService).toHaveBeenCalledTimes(1)
    expect(serviceMock.productService).toHaveBeenCalledWith({
      fields: ["name", "id"],
      options: { id: expect.arrayContaining([101, 102, 103]) },
    })
  })

  it("Query a service using more than 1 argument, expanding a property with another argument", async () => {
    const query = {
      service: "user",
      args: [
        {
          name: "id",
          value: "1",
        },
        {
          name: "role",
          value: "admin",
        },
      ],
      fields: ["username", "email", "products"],
      expands: [
        {
          property: "products",
          fields: ["product"],
        },
        {
          property: "products.product",
          fields: ["name"],
          args: [
            {
              name: "limit",
              value: "5",
            },
          ],
        },
      ],
    }

    await joiner.query(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      args: [
        {
          name: "role",
          value: "admin",
        },
      ],
      fields: ["username", "email", "products"],
      expands: {
        products: {
          args: undefined,
          fields: ["product_id"],
        },
      },
      options: { id: ["1"] },
    })

    expect(serviceMock.productService).toHaveBeenCalledTimes(1)
    expect(serviceMock.productService).toHaveBeenCalledWith({
      fields: ["name", "id"],
      options: { id: expect.arrayContaining([101, 102, 103]) },
      args: [
        {
          name: "limit",
          value: "5",
        },
      ],
    })
  })

  it("Query a service expanding multiple nested properties", async () => {
    const query = {
      service: "order",
      fields: ["number", "date", "products"],
      expands: [
        {
          property: "products",
          fields: ["product"],
        },
        {
          property: "products.product",
          fields: ["handler"],
        },
        {
          property: "user",
          fields: ["fullname", "email", "products"],
        },
        {
          property: "user.products",
          fields: ["product"],
        },
        {
          property: "user.products.product",
          fields: ["name"],
        },
      ],
    }

    await joiner.query(query)

    expect(serviceMock.orderService).toHaveBeenCalledTimes(1)
    expect(serviceMock.orderService).toHaveBeenCalledWith({
      args: undefined,
      fields: ["number", "date", "products", "user_id"],
      expands: {
        products: {
          args: undefined,
          fields: ["product_id"],
        },
      },
      options: { id: undefined },
    })

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      fields: ["fullname", "email", "products", "id"],
      args: undefined,
      expands: {
        products: {
          args: undefined,
          fields: ["product_id"],
        },
      },
      options: { id: [4, 1] },
    })

    expect(serviceMock.productService).toHaveBeenCalledTimes(2)
    expect(serviceMock.productService).toHaveBeenNthCalledWith(1, {
      fields: ["handler", "id"],
      options: { id: expect.arrayContaining([101, 103]) },
    })

    expect(serviceMock.productService).toHaveBeenNthCalledWith(2, {
      fields: ["name", "id"],
      options: { id: expect.arrayContaining([103, 102]) },
    })
  })

  it("should not lose fields when querying with specific nested fields and wildcard on deeply nested relations", async () => {
    // This ensures that when we have:
    // - A specific field from the root entity (product.name)
    // - A specific field from an intermediate relation (links.metadata)
    // - A wildcard on a relation accessed through that intermediate (links.post.*)
    // ...the intermediate field (links.metadata) is not lost
    const query = {
      alias: "product",
      fields: ["id", "name"],
      expands: [
        {
          property: "links",
          fields: ["metadata"],
        },
        {
          property: "posts",
          fields: ["*"],
        },
      ],
      args: undefined,
    }

    const result = await joiner.query(query)

    expect(serviceMock.productService).toHaveBeenCalledTimes(1)
    expect(serviceMock.productService).toHaveBeenCalledWith({
      args: undefined,
      fields: expect.arrayContaining(["id", "name"]),
      expands: undefined,
      options: { id: undefined },
    })

    expect(serviceMock.linkService).toHaveBeenCalledTimes(1)
    expect(serviceMock.linkService).toHaveBeenCalledWith({
      args: undefined,
      expands: undefined,
      fields: expect.arrayContaining(["metadata", "product_id"]),
      options: { product_id: expect.arrayContaining([101, 102, 103]) },
    })

    expect(serviceMock.postService).toHaveBeenCalledTimes(1)
    expect(serviceMock.postService).toHaveBeenCalledWith({
      args: undefined,
      expands: undefined,
      fields: ["*", "id"],
      options: { id: [501, 502, 503] }, // All posts are fetched
    })

    expect(result.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 101,
          name: "Product 1",
          links: expect.objectContaining({
            metadata: expect.objectContaining({
              source: expect.any(String),
              category: expect.any(String),
            }),
          }),
          posts: expect.objectContaining({
            id: 501,
            title: expect.any(String),
            content: expect.any(String),
            author: expect.any(String),
            published: expect.any(Boolean),
            views: expect.any(Number),
          }),
        }),
      ])
    )

    // Critical assertion: metadata must not be lost
    const firstProduct = result.rows[0]
    expect(firstProduct.links).toBeDefined()
    expect(firstProduct.links).toHaveProperty("metadata")
    expect(firstProduct.links.metadata).toEqual({
      source: "blog",
      category: "tech",
    })

    // posts.* should include all fields
    expect(firstProduct).toHaveProperty("posts")
    expect(firstProduct.posts).toHaveProperty("id")
    expect(firstProduct.posts).toHaveProperty("title")
    expect(firstProduct.posts).toHaveProperty("content")
    expect(firstProduct.posts).toHaveProperty("author")
    expect(firstProduct.posts).toHaveProperty("published")
    expect(firstProduct.posts).toHaveProperty("views")
  })

  describe("fieldAlias operations", () => {
    const catalog = createFulfillmentLocationCatalog()

    it("rewrites location fieldAlias and keeps id on real path", () => {
      const serviceConfig = catalog.getServiceConfig({
        serviceAlias: "shipping_option",
      })!

      const plan = compileQuery(
        {
          query: shippingOptionLocationQuery,
          serviceConfig,
          initialData: [],
        },
        catalog
      )

      expect(plan.shortcuts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            property: "location",
            location: ["service_zone", "fulfillment_set"],
            path: [
              "service_zone",
              "fulfillment_set",
              "locations_link",
              "location",
            ],
          }),
        ])
      )

      const locationPath =
        "_root.service_zone.fulfillment_set.locations_link.location"
      const locationsLinkPath =
        "_root.service_zone.fulfillment_set.locations_link"

      expect(plan.expands.has(locationsLinkPath)).toBe(true)
      expect(plan.expands.has(locationPath)).toBe(true)

      const locationExpand = plan.expands.get(locationPath)
      expect(locationExpand?.fields).toEqual(expect.arrayContaining(["id"]))

      expect(
        plan.root.expands?.service_zone?.expands?.fulfillment_set?.fields
      ).toEqual(expect.arrayContaining(["id"]))
    })

    it("plans cross-service stages for nested same-service hops", () => {
      const serviceConfig = catalog.getServiceConfig({
        serviceAlias: "shipping_option",
      })!

      const plan = compileQuery(
        {
          query: shippingOptionLocationQuery,
          serviceConfig,
          initialData: [],
        },
        catalog
      )

      expect(plan.root.executionStages?.length).toBeGreaterThan(1)
      expect(
        plan.root.executionStages?.flatMap((stage) =>
          stage.flatMap((s) => s.paths)
        )
      ).toEqual(
        expect.arrayContaining([
          "_root.service_zone.fulfillment_set.locations_link",
          "_root.service_zone.fulfillment_set.locations_link.location",
        ])
      )
    })

    it("resolves service_zone.fulfillment_set.location.id on shipping_option", async () => {
      const joiner = new RemoteJoiner(
        fulfillmentLocationJoinerConfigs,
        fulfillmentLocationDataFetcher,
        { autoCreateServiceNameAlias: false }
      )

      const result = await joiner.query(shippingOptionLocationQuery)

      expect(result).toEqual([
        expect.objectContaining({
          id: "so_1",
          service_zone: expect.objectContaining({
            fulfillment_set: expect.objectContaining({
              location: expect.objectContaining({ id: "sloc_1" }),
            }),
          }),
        }),
      ])
    })
  })
})
