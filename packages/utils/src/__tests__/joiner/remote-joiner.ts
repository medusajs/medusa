import { MedusaContainer } from "@medusajs/types"
import { RemoteJoiner } from "./../../joiner"

import { serviceConfigs, serviceMock } from "../../__mocks__/joiner/mock_data"

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

    await joiner.query(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      args: [],
      fields: ["id", "name", "email"],
      options: { id: ["1"] },
    })
  })

  it("Transforms main service name into PascalCase", async () => {
    const query = {
      service: "user",
      fields: ["id"],
    }

    await joiner.query(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
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

    await joiner.query(query)

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

    const a = await joiner.query(query)

    console.log(JSON.stringify(a, null, 2))

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      args: [],
      fields: ["username", "email", "products"],
      expands: {
        products: {
          args: undefined,
          fields: undefined,
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
      service: "Order",
      fields: ["number", "date", "products"],
      expands: [
        {
          property: "products",
          fields: ["product", "user"],
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
          property: "user.products.product",
          fields: ["name"],
        },
      ],
      args: [
        {
          name: "id",
          value: "3",
        },
      ],
    }

    await joiner.query(query)

    expect(serviceMock.orderService).toHaveBeenCalledTimes(1)
    expect(serviceMock.orderService).toHaveBeenCalledWith({
      args: [],
      fields: ["number", "date", "products", "user_id"],
      options: { id: ["3"] },
    })

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      fields: ["fullname", "email", "products", "id"],
      options: { id: [4, 1] },
    })

    expect(serviceMock.productService).toHaveBeenCalledTimes(2)
    expect(serviceMock.productService).toHaveBeenNthCalledWith(1, {
      fields: ["name", "id"],
      options: { id: expect.arrayContaining([103, 102]) },
    })

    expect(serviceMock.productService).toHaveBeenNthCalledWith(2, {
      fields: ["handler", "id"],
      options: { id: expect.arrayContaining([101, 103]) },
    })
  })
})
