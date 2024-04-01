import { MedusaContainer, RemoteExpandProperty } from "@medusajs/types"
import { lowerCaseFirst, toPascalCase } from "@medusajs/utils"
import { remoteJoinerData } from "../../__fixtures__/joiner/data"
import { serviceConfigs, serviceMock } from "../../__mocks__/joiner/mock_data"
import { RemoteJoiner } from "../../joiner"

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

    const service = container.resolve(moduleRegistryName)
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

describe("RemoteJoiner", () => {
  let joiner: RemoteJoiner
  beforeAll(() => {
    joiner = new RemoteJoiner(serviceConfigs, fetchServiceDataCallback)
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
    const query = RemoteJoiner.parseQuery(`
      query {
        product {
          id
          name
        }
      }
    `)
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
            product_id: [101, 103],
            product: [
              {
                name: "Product 1",
                id: 101,
              },
              {
                name: "Product 3",
                id: 103,
              },
            ],
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
    const query = RemoteJoiner.parseQuery(`
      query {
        variant {
          id
          name
          orders {
            order {
              number
              products {
                quantity
                product {
                  name
                }
                variant {
                  name
                }
              }
            }
          }
        }
      }
    `)
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
                  product_id: [101, 103],
                  variant_id: 993,
                  quantity: 4,
                  product: [
                    {
                      name: "Product 1",
                      id: 101,
                    },
                    {
                      name: "Product 3",
                      id: 103,
                    },
                  ],
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
                product_id: [101, 103],
                variant_id: 993,
                quantity: 4,
                product: [
                  {
                    name: "Product 1",
                    id: 101,
                  },
                  {
                    name: "Product 3",
                    id: 103,
                  },
                ],
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
    const query = RemoteJoiner.parseQuery(`
      query {
        order {
          product_user_alias {
            email
          }
        }
      }
    `)
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
        product_user_alias: [
          {
            email: "janedoe@example.com",
            id: 2,
          },
          {
            email: "aaa@example.com",
            id: 3,
          },
        ],
      }),
    ])
    expect(data[0].products[0].product).toEqual(undefined)
  })

  it("Should query an field alias and keep queried nested levels", async () => {
    const query = RemoteJoiner.parseQuery(`
      query {
        order {
          product_user_alias {
            email
          }
          products {
            product {
              name
            }
          }
        }
      }
    `)
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
        product_user_alias: [
          {
            email: "janedoe@example.com",
            id: 2,
          },
          {
            email: "aaa@example.com",
            id: 3,
          },
        ],
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
    const query = RemoteJoiner.parseQuery(`
      query {
        order {
          product_user_alias {
            email
          }
          products {
            product {
              user {
                name
              }
            }
          }
        }
      }
    `)
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
        product_user_alias: [
          {
            name: "Jane Doe",
            id: 2,
            email: "janedoe@example.com",
          },
          {
            name: "aaa bbb",
            id: 3,
            email: "aaa@example.com",
          },
        ],
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
    const query = RemoteJoiner.parseQuery(`
      query {
        order {
          id
          product_user_alias (arg: { random: 123 }) {
            name
          }
          products {
            variant {
              user_shortcut(arg: 123) {
                name
                email
                products {
                  product {
                    handler
                  }
                }
              }
            }
          }
        }
      }
    `)
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
          service: "user",
          fieds: ["name", "id"],
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
        product_user_alias: [
          {
            id: 2,
            name: "Jane Doe",
          },
          {
            id: 3,
            name: "aaa bbb",
          },
        ],
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
    const newJoiner = new RemoteJoiner(
      serviceConfigs,
      fetchServiceDataCallback,
      { autoCreateServiceNameAlias: false }
    )

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

    expect(newJoiner.query(queryWithAlias)).rejects.toThrowError(
      `Service with alias "user" was not found.`
    )
  })

  it("Should throw when any key of the entrypoint isn't found", async () => {
    const query = RemoteJoiner.parseQuery(`
      query {
        order (id: 201) {
          id
          number
        }
      }
    `)
    const data = await joiner.query(query, {
      throwIfKeyNotFound: true,
    })

    expect(data.length).toEqual(1)

    const queryNotFound = RemoteJoiner.parseQuery(`
      query {
        order (id: "ord_1234556") {
          id
          number
        }
      }
    `)
    const dataNotFound = joiner.query(queryNotFound, {
      throwIfKeyNotFound: true,
    })

    expect(dataNotFound).rejects.toThrowError("order id not found: ord_1234556")
  })
})
