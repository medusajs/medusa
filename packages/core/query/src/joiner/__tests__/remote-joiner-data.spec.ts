import { IModuleService, MedusaContainer } from "@medusajs/types"
import { lowerCaseFirst, toPascalCase } from "@medusajs/utils"
import {
  IRemoteDataFetcher,
  RemoteExpandProperty,
  RemoteJoiner,
} from ".."
import { remoteJoinerData } from "../__fixtures__/data"
import { serviceConfigs, serviceMock } from "../__mocks__/mock_data"

const container = {
  resolve: (serviceName) => {
    return {
      list: (...args) => {
        return serviceMock[serviceName].apply(this, args)
      },
      getByVariantId: (options) => {
        if (serviceName !== "orderService") {
          return
        }

        let orderVar = JSON.parse(
          JSON.stringify(remoteJoinerData.order_variant)
        )

        if (options.expands?.order) {
          orderVar = orderVar.map((item) => {
            item.order = JSON.parse(
              JSON.stringify(
                remoteJoinerData.order.find((o) => o.id === item.order_id)
              )
            )
            return item
          })
        }

        return {
          data: orderVar,
        }
      },
    }
  },
} as MedusaContainer

const callbacks = jest.fn()
const fetchServiceDataCallback = jest.fn(
  async (
    expand: RemoteExpandProperty,
    pkField: string,
    ids?: (unknown | unknown[])[],
    relationship?: any
  ) => {
    const serviceConfig = expand.serviceConfig
    const moduleRegistryName = !serviceConfig.serviceName.endsWith("Service")
      ? lowerCaseFirst(serviceConfig.serviceName) + "Service"
      : serviceConfig.serviceName

    const service: IModuleService = container.resolve(moduleRegistryName)
    const methodName = relationship?.inverse
      ? `getBy${toPascalCase(pkField)}`
      : "list"

    callbacks({
      service: serviceConfig.serviceName,
      fieds: expand.fields,
      args: expand.args,
    })

    return await service[methodName]({
      fields: expand.fields,
      args: expand.args,
      expands: expand.expands,
      options: {
        [pkField]: ids,
      },
    })
  }
)

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

    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "janedoe@example.com",
      },
      {
        id: 3,
        name: "aaa bbb",
        email: "aaa@example.com",
      },
      {
        id: 4,
        name: "a4444 44 44",
        email: "444444@example.com",
      },
    ])
  })

  it("Simple query of a service where the returned data contains multiple properties", async () => {
    const query = {
      alias: "product",
      fields: ["id", "name"],
      expands: [],
    }
    const data = await joiner.query(query)

    expect(data).toEqual({
      rows: [
        {
          id: 101,
          name: "Product 1",
        },
        {
          id: 102,
          name: "Product 2",
        },
        {
          id: 103,
          name: "Product 3",
        },
      ],
      limit: 3,
      skip: 0,
    })
  })

  it("Query of a service, expanding a property and restricting the fields expanded", async () => {
    const query = {
      service: "user",
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      fields: ["username", "email", "products"],
      expands: [
        {
          property: "products.product",
          fields: ["name"],
        },
      ],
    }

    const data = await joiner.query(query)
    expect(data).toEqual([
      {
        email: "johndoe@example.com",
        products: [
          {
            product_id: 102,
            product: {
              name: "Product 2",
              id: 102,
            },
          },
        ],
      },
      {
        email: "janedoe@example.com",
        products: [
          {
            product_id: [101, 102],
            product: [
              {
                name: "Product 1",
                id: 101,
              },
              {
                name: "Product 2",
                id: 102,
              },
            ],
          },
        ],
      },
      {
        email: "aaa@example.com",
      },
      {
        email: "444444@example.com",
        products: [
          {
            product_id: 103,
            product: {
              name: "Product 3",
              id: 103,
            },
          },
        ],
      },
    ])
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
          fields: ["name"],
        },
        {
          property: "user",
          fields: ["fullname", "email", "products"],
        },
        {
          property: "user.products.product",
          fields: ["name"],
        },
      ],
      args: [],
    }

    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        number: "ORD-001",
        date: "2023-04-01T12:00:00Z",
        products: [
          {
            product_id: 101,
            product: {
              name: "Product 1",
              id: 101,
            },
          },
          {
            product_id: 101,
            product: {
              name: "Product 1",
              id: 101,
            },
          },
        ],
        user_id: 4,
        user: {
          fullname: "444 Doe full name",
          email: "444444@example.com",
          products: [
            {
              product_id: 103,
              product: {
                name: "Product 3",
                id: 103,
              },
            },
          ],
          id: 4,
        },
      },
      {
        number: "ORD-202",
        date: "2023-04-01T12:00:00Z",
        products: [
          {
            product_id: 103,
            product: {
              name: "Product 3",
              id: 103,
            },
          },
        ],
        user_id: 1,
        user: {
          fullname: "John Doe full name",
          email: "johndoe@example.com",
          products: [
            {
              product_id: 102,
              product: {
                name: "Product 2",
                id: 102,
              },
            },
          ],
          id: 1,
        },
      },
    ])
  })

  it("Query a service expanding an inverse relation", async () => {
    const query = {
      alias: "variant",
      fields: ["id", "name", "orders"],
      expands: [
        {
          property: "orders",
          fields: ["order"],
        },
        {
          property: "orders.order",
          fields: ["number", "products"],
        },
        {
          property: "orders.order.products",
          fields: ["quantity", "product", "variant"],
        },
        {
          property: "orders.order.products.product",
          fields: ["name"],
        },
        {
          property: "orders.order.products.variant",
          fields: ["name"],
        },
      ],
    }
    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        id: 991,
        name: "Product variant 1",
        orders: {
          order: {
            number: "ORD-001",
            products: [
              {
                product_id: 101,
                variant_id: 991,
                quantity: 1,
                product: {
                  name: "Product 1",
                  id: 101,
                },
                variant: {
                  name: "Product variant 1",
                  id: 991,
                  product_id: 101,
                },
              },
              {
                product_id: 101,
                variant_id: 992,
                quantity: 5,
                product: {
                  name: "Product 1",
                  id: 101,
                },
                variant: {
                  name: "Product variant 2",
                  id: 992,
                  product_id: 101,
                },
              },
            ],
            id: 201,
          },
          variant_id: 991,
          order_id: 201,
        },
      },
      {
        id: 992,
        name: "Product variant 2",
        orders: [
          {
            order: {
              number: "ORD-001",
              products: [
                {
                  product_id: 101,
                  variant_id: 991,
                  quantity: 1,
                  product: {
                    name: "Product 1",
                    id: 101,
                  },
                  variant: {
                    name: "Product variant 1",
                    id: 991,
                    product_id: 101,
                  },
                },
                {
                  product_id: 101,
                  variant_id: 992,
                  quantity: 5,
                  product: {
                    name: "Product 1",
                    id: 101,
                  },
                  variant: {
                    name: "Product variant 2",
                    id: 992,
                    product_id: 101,
                  },
                },
              ],
              id: 201,
            },
            variant_id: 992,
            order_id: 201,
          },
          {
            order: {
              number: "ORD-202",
              products: [
                {
                  product_id: 103,
                  variant_id: 993,
                  quantity: 4,
                  product: {
                    name: "Product 3",
                    id: 103,
                  },
                  variant: {
                    id: 993,
                    name: "Product variant 33",
                    product_id: 103,
                  },
                },
              ],
              id: 205,
            },
            variant_id: 992,
            order_id: 205,
          },
        ],
      },
      {
        id: 993,
        name: "Product variant 33",
        orders: {
          order: {
            number: "ORD-202",
            products: [
              {
                product_id: 103,
                variant_id: 993,
                quantity: 4,
                product: {
                  name: "Product 3",
                  id: 103,
                },
                variant: {
                  id: 993,
                  name: "Product variant 33",
                  product_id: 103,
                },
              },
            ],
            id: 205,
          },
          variant_id: 993,
          order_id: 205,
        },
      },
    ])
  })

  it("Should query an field alias and cleanup unused nested levels", async () => {
    const query = {
      alias: "order",
      fields: ["product_user_alias"],
      expands: [
        {
          property: "product_user_alias",
          fields: ["email"],
        },
      ],
    }
    const data = await joiner.query(query)

    expect(data).toEqual([
      expect.objectContaining({
        product_user_alias: [
          {
            email: "janedoe@example.com",
            id: 2,
          },
          {
            email: "janedoe@example.com",
            id: 2,
          },
        ],
      }),
      expect.objectContaining({
        product_user_alias: {
          email: "aaa@example.com",
          id: 3,
        },
      }),
    ])
    expect(data[0].products[0].product).toEqual(undefined)
  })

  it("Should query an field alias and keep queried nested levels", async () => {
    const query = {
      alias: "order",
      fields: ["product_user_alias", "products"],
      expands: [
        {
          property: "product_user_alias",
          fields: ["email"],
        },
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
    const data = await joiner.query(query)

    expect(data).toEqual([
      expect.objectContaining({
        product_user_alias: [
          {
            email: "janedoe@example.com",
            id: 2,
          },
          {
            email: "janedoe@example.com",
            id: 2,
          },
        ],
      }),
      expect.objectContaining({
        product_user_alias: {
          email: "aaa@example.com",
          id: 3,
        },
      }),
    ])
    expect(data[0].products[0].product).toEqual({
      name: "Product 1",
      id: 101,
      user_id: 2,
    })
    expect(data[0].products[0].product.user).toEqual(undefined)
  })

  it("Should query an field alias and merge requested fields on alias and on the relationship", async () => {
    const query = {
      alias: "order",
      fields: ["product_user_alias", "products"],
      expands: [
        {
          property: "product_user_alias",
          fields: ["email"],
        },
        {
          property: "products",
          fields: ["product"],
        },
        {
          property: "products.product",
          fields: ["user"],
        },
        {
          property: "products.product.user",
          fields: ["name"],
        },
      ],
    }
    const data = await joiner.query(query)

    expect(data).toEqual([
      expect.objectContaining({
        product_user_alias: [
          {
            name: "Jane Doe",
            id: 2,
            email: "janedoe@example.com",
          },
          {
            name: "Jane Doe",
            id: 2,
            email: "janedoe@example.com",
          },
        ],
      }),
      expect.objectContaining({
        product_user_alias: {
          name: "aaa bbb",
          id: 3,
          email: "aaa@example.com",
        },
      }),
    ])
    expect(data[0].products[0].product).toEqual({
      id: 101,
      user_id: 2,
      user: {
        name: "Jane Doe",
        id: 2,
        email: "janedoe@example.com",
      },
    })
  })

  it("Should query multiple aliases and pass the arguments where defined on 'forwardArgumentsOnPath'", async () => {
    const query = {
      alias: "order",
      fields: ["id", "product_user_alias", "products"],
      expands: [
        {
          property: "product_user_alias",
          fields: ["name"],
          args: [
            {
              name: "arg",
              value: {
                random: 123,
              },
            },
          ],
        },
        {
          property: "products",
          fields: ["variant"],
        },
        {
          property: "products.variant",
          fields: ["user_shortcut"],
        },
        {
          property: "products.variant.user_shortcut",
          fields: ["name", "email", "products"],
          args: [
            {
              name: "arg",
              value: 123,
            },
          ],
        },
        {
          property: "products.variant.user_shortcut.products",
          fields: ["product"],
        },
        {
          property: "products.variant.user_shortcut.products.product",
          fields: ["handler"],
        },
      ],
    }
    const data = await joiner.query(query)

    expect(callbacks.mock.calls).toEqual([
      [
        {
          service: "order",
          fieds: ["id", "products"],
        },
      ],
      [
        {
          service: "product",
          fieds: ["id", "user_id"],
          args: [
            {
              name: "arg",
              value: {
                random: 123,
              },
            },
          ],
        },
      ],
      [
        {
          service: "variantService",
          fieds: ["id", "product_id"],
        },
      ],
      [
        {
          service: "user",
          fieds: ["name", "id"],
        },
      ],

      [
        {
          service: "product",
          fieds: ["id", "user_id"],
        },
      ],
      [
        {
          service: "user",
          fieds: ["name", "email", "products", "id"],
        },
      ],
      [
        {
          service: "product",
          fieds: ["handler", "id"],
        },
      ],
    ])

    expect(data[1]).toEqual(
      expect.objectContaining({
        product_user_alias: {
          id: 3,
          name: "aaa bbb",
        },
      })
    )

    expect(data[0].products[0]).toEqual({
      variant_id: 991,
      product_id: 101,
      variant: {
        id: 991,
        product_id: 101,
        user_shortcut: {
          email: "janedoe@example.com",
          id: 2,
          name: "Jane Doe",
          products: [
            {
              product_id: [101, 102],
              product: [
                {
                  handler: "product-1-handler",
                  id: 101,
                },
                {
                  handler: "product-2-handler",
                  id: 102,
                },
              ],
            },
          ],
        },
      },
    })
  })

  it("It shouldn't register the service name as an alias if option autoCreateServiceNameAlias is false", async () => {
    const newJoiner = new RemoteJoiner(serviceConfigs, dataFetcher, {
      autoCreateServiceNameAlias: false,
    })

    const query = {
      service: "user",
      fields: ["id", "name", "email"],
    }

    const data = await newJoiner.query(query)

    expect(data).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          name: "John Doe",
          email: "johndoe@example.com",
        },
      ])
    )

    const queryWithAlias = {
      alias: "user",
      fields: ["id", "name", "email"],
    }

    await expect(newJoiner.query(queryWithAlias)).rejects.toThrowError(
      `Service with alias "user" was not found.`
    )
  })

  it("Should throw when any key of the entrypoint isn't found", async () => {
    const query = {
      alias: "order",
      fields: ["id", "number"],
      expands: [],
      args: [
        {
          name: "id",
          value: 201,
        },
      ],
    }
    const data = await joiner.query(query, {
      throwIfKeyNotFound: true,
    })

    expect(data.length).toEqual(1)

    const queryNotFound = {
      alias: "order",
      fields: ["id", "number"],
      expands: [],
      args: [
        {
          name: "id",
          value: "ord_1234556",
        },
      ],
    }
    const dataNotFound = joiner.query(queryNotFound, {
      throwIfKeyNotFound: true,
    })

    await expect(dataNotFound).rejects.toThrowError(
      "order id not found: ord_1234556"
    )

    const queryNotFoundNoParam = {
      alias: "order",
      fields: ["id", "number"],
      expands: [],
    }
    const dataNotFoundNoPK = joiner.query(queryNotFoundNoParam, {
      throwIfKeyNotFound: true,
    })

    await expect(dataNotFoundNoPK).rejects.toThrowError(
      "order: Primary key(s) [id] not found in filters"
    )
  })

  describe("with composite primary keys", () => {
    const compositeConfigs = [
      {
        serviceName: "region",
        entity: "Region",
        primaryKeys: ["id", "iso_2"],
        alias: [{ name: "region", args: { entity: "Region" } }],
      },
      {
        serviceName: "country",
        entity: "Country",
        primaryKeys: ["id", "iso_2"],
        alias: [{ name: "country", args: { entity: "Country" } }],
      },
    ]

    let compositeJoiner: RemoteJoiner

    beforeAll(() => {
      compositeJoiner = new RemoteJoiner(compositeConfigs, {
        fetch: async () => ({
          data: [],
        }),
      })
    })

    it("should fail when primary keys are not passed in filters", async () => {
      await expect(
        compositeJoiner.query(
          {
            alias: "region",
            fields: ["id", "currency_code"],
            expands: [],
          },
          { throwIfKeyNotFound: true }
        )
      ).rejects.toThrow(
        "region: Primary key(s) [id, iso_2] not found in filters"
      )

      await expect(
        compositeJoiner.query(
          {
            alias: "country",
            fields: ["id"],
            expands: [],
          },
          { throwIfKeyNotFound: true }
        )
      ).rejects.toThrow(
        "country: Primary key(s) [id, iso_2] not found in filters"
      )

      await expect(
        compositeJoiner.query(
          {
            alias: "country",
            fields: ["id"],
            expands: [],
            args: [
              {
                name: "iso_2",
                value: null,
              },
            ],
          },
          {
            throwIfKeyNotFound: true,
          }
        )
      ).rejects.toThrow(
        "country: Value for primary key iso_2 not found in filters"
      )

      await expect(
        compositeJoiner.query(
          {
            alias: "region",
            fields: ["id", "currency_code"],
            expands: [],
            args: [
              {
                name: "id",
                value: null,
              },
            ],
          },
          { throwIfKeyNotFound: true }
        )
      ).rejects.toThrow("region: Value for primary key id not found in filters")

      await expect(
        compositeJoiner.query(
          {
            alias: "region",
            fields: ["id", "currency_code"],
            expands: [],
            args: [
              {
                name: "currency_code",
                value: "EUR",
              },
            ],
          },
          {
            throwIfKeyNotFound: true,
          }
        )
      ).rejects.toThrow(
        "region: Primary key(s) [id, iso_2] not found in filters"
      )
    })
  })

  it("Should merge initial data with data fetched", async () => {
    const query = {
      alias: "order",
      fields: ["id", "number", "products"],
      expands: [
        {
          property: "products",
          fields: ["variant"],
        },
        {
          property: "products.variant",
          fields: ["name", "product"],
        },
        {
          property: "products.variant.product",
          fields: ["handler", "user"],
        },
        {
          property: "products.variant.product.user",
          fields: ["name"],
        },
      ],
    }

    const initialData = [
      {
        id: 201,
        extra_field: "extra",
        metadata: {
          some: "data",
        },
        products: [
          {
            product_id: 101,
            variant_id: 991,
            color: "red",
            variant: {
              id: 991,
              product_id: 101,
              variant_extra_field: "extra 101 - var 991 - red",
            },
          },
          {
            product_id: 101,
            variant_id: 992,
            color: "green",
            variant: {
              id: 992,
              product_id: 101,
              variant_extra_field: "extra 101 - var 992 - green",
            },
          },
        ],
      },
      {
        id: 205,
        extra_field: "extra",
      },
    ]

    const data = await joiner.query(query, {
      initialData,
    })

    expect(data).toEqual([
      {
        id: 201,
        number: "ORD-001",
        products: [
          {
            product_id: 101,
            variant_id: 991,
            color: "red",
            variant: {
              id: 991,
              product_id: 101,
              variant_extra_field: "extra 101 - var 991 - red",
              name: "Product variant 1",
              product: {
                handler: "product-1-handler",
                id: 101,
                user_id: 2,
                user: {
                  name: "Jane Doe",
                  id: 2,
                },
              },
            },
          },
          {
            product_id: 101,
            variant_id: 992,
            color: "green",
            variant: {
              id: 992,
              product_id: 101,
              variant_extra_field: "extra 101 - var 992 - green",
              name: "Product variant 2",
              product: {
                handler: "product-1-handler",
                id: 101,
                user_id: 2,
                user: {
                  name: "Jane Doe",
                  id: 2,
                },
              },
            },
          },
        ],
        extra_field: "extra",
        metadata: {
          some: "data",
        },
      },
      {
        id: 205,
        number: "ORD-202",
        products: [
          {
            variant_id: 993,
            product_id: 103,
            variant: {
              name: "Product variant 33",
              id: 993,
              product_id: 103,
              product: {
                handler: "product-3-handler",
                id: 103,
                user_id: 3,
                user: {
                  name: "aaa bbb",
                  id: 3,
                },
              },
            },
          },
        ],
        extra_field: "extra",
      },
    ])
  })
})
