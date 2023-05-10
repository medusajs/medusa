import { MedusaContainer } from "@medusajs/types"
import { RemoteJoiner, ServiceConfig } from "./../../joiner"

const serviceConfigs: ServiceConfig[] = [
  {
    serviceName: "User",
    primaryKeys: ["id"],
    relationships: [
      {
        foreignKey: "products.product_id",
        serviceName: "Product",
        primaryKey: "id",
        alias: "product",
      },
    ],
  },
  {
    serviceName: "Product",
    primaryKeys: ["id", "sku"],
    relationships: [
      {
        foreignKey: "user_id",
        serviceName: "User",
        primaryKey: "id",
        alias: "user",
      },
    ],
  },
  {
    serviceName: "Variant",
    primaryKeys: ["id"],
    relationships: [
      {
        foreignKey: "user_id",
        serviceName: "User",
        primaryKey: "id",
        alias: "user",
      },
      {
        foreignKey: "product_id",
        serviceName: "Product",
        primaryKey: "id",
        alias: "product",
      },
      {
        foreignKey: "variant_id",
        primaryKey: "id",
        serviceName: "Order",
        alias: "orders",
        inverse: true, // In an inverted relationship the foreign key is on Order and the primary key is on variant
      },
    ],
  },
  {
    serviceName: "Order",
    primaryKeys: ["id"],
    relationships: [
      {
        foreignKey: "product_id",
        serviceName: "Product",
        primaryKey: "id",
        alias: "product",
      },
      {
        foreignKey: "products.variant_id,product_id",
        serviceName: "Variant",
        primaryKey: "id,product_id",
        alias: "variant",
      },
      {
        foreignKey: "user_id",
        serviceName: "User",
        primaryKey: "id",
        alias: "user",
      },
    ],
  },
]

const mock = {
  user: [
    {
      id: 1,
      email: "johndoe@example.com",
      name: "John Doe",
      fullname: "John Doe full name",
      products: [
        {
          id: 1,
          product_id: 102,
        },
      ],
      nested: {
        lala: "lala",
        multiple: [
          {
            abc: 1,
          },
          {
            abc: 2,
          },
        ],
      },
    },
    {
      id: 2,
      email: "janedoe@example.com",
      name: "Jane Doe",
      products: [
        {
          id: 2,
          product_id: [101, 102],
        },
      ],
      nested: {
        lala: "lele",
        multiple: [
          {
            a: 33,
          },
          {
            a: 44,
          },
        ],
      },
    },
    {
      id: 3,
      email: "aaa@example.com",
      name: "aaa bbb",
      fullname: "3333 Doe full name",
      nested: {
        lala: "lolo",
        multiple: [
          {
            a: 555,
          },
          {
            a: 555,
          },
        ],
      },
    },
    {
      id: 4,
      email: "444444@example.com",
      name: "a4444 44 44",
      fullname: "444 Doe full name",
      products: [
        {
          id: 4,
          product_id: 103,
        },
      ],
      nested: {
        lala: "lulu",
        multiple: [
          {
            a: 6666,
          },
          {
            a: 7777,
          },
        ],
      },
    },
  ],
  product: [
    {
      id: 101,
      name: "Product 1",
      handler: "product-1-handler",
      user_id: 2,
    },
    {
      id: 102,
      name: "Product 2",
      handler: "product-2-handler",
      user_id: 1,
    },
    {
      id: 103,
      name: "Product 3",
      handler: "product-3-handler",
      user_id: 3,
    },
  ],
  variant: [
    {
      id: 991,
      name: "Product variant 1",
      product_id: 101,
    },
    {
      id: 992,
      name: "Product variant 2",
      product_id: 101,
    },
    {
      id: 993,
      name: "Product variant 33",
      product_id: 103,
    },
  ],
  order_variant: [
    {
      order_id: 201,
      variant_id: 991,
      quantity: 1,
    },
    {
      order_id: 201,
      variant_id: 992,
      quantity: 5,
    },
    {
      order_id: 205,
      variant_id: 992,
      quantity: 4,
    },
    {
      order_id: 205,
      variant_id: 993,
      quantity: 1,
    },
  ],
  order: [
    {
      id: 201,
      number: "ORD-001",
      date: "2023-04-01T12:00:00Z",
      products: [
        {
          product_id: 101,
          variant_id: 991,
          quantity: 1,
        },
        {
          product_id: 101,
          variant_id: 992,
          quantity: 5,
        },
      ],
      user_id: 4,
    },
    {
      id: 205,
      number: "ORD-202",
      date: "2023-04-01T12:00:00Z",
      products: [
        {
          product_id: [101, 103],
          variant_id: 993,
          quantity: 4,
        },
      ],
      user_id: 4,
    },
  ],
}

const mockServiceList = (serviceName) => {
  return jest.fn().mockImplementation((data) => {
    const src = {
      userService: mock.user,
      productService: mock.product,
      variantService: mock.variant,
      orderService: mock.order,
    }

    if (
      data.relationship?.inverse &&
      data.relationship?.foreignKey === "variant_id"
    ) {
      return {
        data: JSON.parse(JSON.stringify(mock.order_variant)),
      }
    }

    let resultset = JSON.parse(JSON.stringify(src[serviceName]))

    if (
      serviceName === "User" &&
      !data.fields?.some((field) => field.includes("multiple"))
    ) {
      resultset = resultset.map((item) => {
        delete item.nested.multiple
        return item
      })
    }

    return {
      data: resultset,
    }
  })
}

const serviceMock = {
  userService: mockServiceList("userService"),
  productService: mockServiceList("productService"),
}

const container = {
  resolve: (serviceName) => {
    return {
      list: (...args) => {
        return serviceMock[serviceName].apply(this, args)
      },
    }
  },
} as MedusaContainer

describe("RemoteJoiner", () => {
  let joiner: RemoteJoiner
  beforeAll(() => {
    joiner = new RemoteJoiner(container, serviceConfigs)
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Simple query of a service, its id and no fields specified", async () => {
    const query = {
      service: "User",
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      fields: ["id", "name", "email"],
    }

    await joiner.join(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      args: [],
      fields: ["id", "name", "email"],
      options: { id: ["1"] },
    })
  })

  it("Simple query of a service, its id and a few fields specified", async () => {
    const query = {
      service: "User",
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      fields: ["username", "email"],
    }

    await joiner.join(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      args: [],
      fields: ["username", "email"],
      options: { id: ["1"] },
    })
  })

  it("Query of a service, expanding a property and restricting the fields expanded", async () => {
    const query = {
      service: "User",
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

    await joiner.join(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      args: [],
      fields: ["username", "email", "products"],
      options: { id: ["1"] },
    })

    expect(serviceMock.productService).toHaveBeenCalledTimes(1)
    expect(serviceMock.productService).toHaveBeenCalledWith({
      fields: ["name", "id"],
      options: { product_id: expect.arrayContaining([101, 102, 103]) },
    })
  })

  it("Query a service using more than 1 argument, expanding a property with another argument", async () => {
    const query = {
      service: "User",
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

    await joiner.join(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      args: [
        {
          name: "role",
          value: "admin",
        },
      ],
      fields: ["username", "email", "products"],
      options: { id: ["1"] },
    })

    expect(serviceMock.productService).toHaveBeenCalledTimes(1)
    expect(serviceMock.productService).toHaveBeenCalledWith({
      fields: ["name", "id"],
      options: { product_id: expect.arrayContaining([101, 102, 103]) },
      args: [
        {
          name: "limit",
          value: "5",
        },
      ],
    })
  })
})
