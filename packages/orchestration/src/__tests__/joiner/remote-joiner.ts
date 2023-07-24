import { MedusaContainer, RemoteExpandProperty } from "@medusajs/types"
import { lowerCaseFirst, toPascalCase } from "@medusajs/utils"
import { serviceConfigs, serviceMock } from "../../__mocks__/joiner/mock_data"
import { RemoteJoiner } from "./../../joiner"

const container = {
  resolve: (serviceName) => {
    return {
      list: (...args) => {
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

  const service = container.resolve(moduleRegistryName)
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

    await joiner.query(query)

    expect(serviceMock.userService).toHaveBeenCalledTimes(1)
    expect(serviceMock.userService).toHaveBeenCalledWith({
      args: [],
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
      args: [],
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
      args: [],
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
      args: [],
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
      expands: {
        products: {
          args: undefined,
          fields: ["product_id"],
        },
      },
      options: { id: ["3"] },
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
      fields: ["name", "id"],
      options: { id: expect.arrayContaining([103, 102]) },
    })

    expect(serviceMock.productService).toHaveBeenNthCalledWith(2, {
      fields: ["handler", "id"],
      options: { id: expect.arrayContaining([101, 103]) },
    })
  })
})
