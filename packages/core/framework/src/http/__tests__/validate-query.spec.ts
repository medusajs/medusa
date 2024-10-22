import z from "zod"
import { MedusaError } from "@medusajs/utils"
import { validateAndTransformQuery } from "../utils/validate-query"
import { MedusaNextFunction, MedusaRequest, MedusaResponse } from "../types"
import { RestrictedFields } from "../utils/restricted-fields"
import { QueryConfig } from "@medusajs/types"

export const createSelectParams = () => {
  return z.object({
    fields: z.string().optional(),
  })
}

const createFindParams = ({
  offset,
  limit,
  order,
}: {
  offset?: number
  limit?: number
  order?: string
} = {}) => {
  const selectParams = createSelectParams()

  return selectParams.merge(
    z.object({
      offset: z.preprocess(
        (val) => {
          if (val && typeof val === "string") {
            return parseInt(val)
          }
          return val
        },
        z
          .number()
          .optional()
          .default(offset ?? 0)
      ),
      limit: z.preprocess(
        (val) => {
          if (val && typeof val === "string") {
            return parseInt(val)
          }
          return val
        },
        z
          .number()
          .optional()
          .default(limit ?? 20)
      ),
      order: order
        ? z.string().optional().default(order)
        : z.string().optional(),
    })
  )
}

describe("validateAndTransformQuery", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should transform the input query", async () => {
    let mockRequest = {
      restrictedFields: new RestrictedFields(),
      query: {},
    } as MedusaRequest
    const mockResponse = {} as MedusaResponse
    const nextFunction: MedusaNextFunction = jest.fn()

    const expectations = ({
      offset,
      limit,
      inputOrder,
      transformedOrder,
    }: {
      offset: number
      limit: number
      inputOrder: string | undefined
      transformedOrder?: Record<string, "ASC" | "DESC">
      relations?: string[]
    }) => {
      expect(mockRequest.validatedQuery).toEqual({
        offset,
        limit,
        order: inputOrder,
      })
      expect(mockRequest.filterableFields).toEqual({})
      expect(mockRequest.listConfig).toEqual({
        take: limit,
        skip: offset,
        select: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "metadata.id",
          "metadata.parent.id",
          "metadata.children.id",
          "metadata.product.id",
        ],
        relations: [
          "metadata",
          "metadata.parent",
          "metadata.children",
          "metadata.product",
        ],
        order: transformedOrder,
      })
      expect(mockRequest.remoteQueryConfig).toEqual({
        fields: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "metadata.id",
          "metadata.parent.id",
          "metadata.children.id",
          "metadata.product.id",
        ],
        pagination: {
          order: transformedOrder,
          skip: offset,
          take: limit,
        },
      })
    }

    let queryConfig: any = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      isList: true,
    }

    let middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expectations({
      limit: 20,
      offset: 0,
      inputOrder: undefined,
    })

    mockRequest = {
      ...mockRequest,
      query: {
        limit: "10",
        offset: "5",
        order: "created_at",
      },
    } as unknown as MedusaRequest

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expectations({
      limit: 10,
      offset: 5,
      inputOrder: "created_at",
      transformedOrder: { created_at: "ASC" },
    })

    mockRequest = {
      ...mockRequest,
      query: {
        limit: "10",
        offset: "5",
        order: "created_at",
      },
    } as unknown as MedusaRequest

    queryConfig = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      isList: true,
    }

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expectations({
      limit: 10,
      offset: 5,
      inputOrder: "created_at",
      transformedOrder: { created_at: "ASC" },
    })
  })

  it("should transform the input query taking into account the fields symbols (+,- or no symbol)", async () => {
    let mockRequest = {
      restrictedFields: new RestrictedFields(),
      query: {
        fields: "id",
      },
    } as unknown as MedusaRequest
    const mockResponse = {} as MedusaResponse
    const nextFunction: MedusaNextFunction = jest.fn()

    let queryConfig: any = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      isList: true,
    }

    let middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(mockRequest.listConfig).toEqual(
      expect.objectContaining({
        select: ["id"],
      })
    )

    mockRequest = {
      ...mockRequest,
      query: {
        fields: "+test_prop,-prop-test-something",
      },
    } as unknown as MedusaRequest

    queryConfig = {
      defaults: [
        "id",
        "prop-test-something",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      isList: true,
    }

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(mockRequest.listConfig).toEqual(
      expect.objectContaining({
        select: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "metadata.id",
          "metadata.parent.id",
          "metadata.children.id",
          "metadata.product.id",
          "test_prop",
        ],
      })
    )

    mockRequest = {
      ...mockRequest,
      query: {
        fields: "+test_prop,-updated_at",
      },
    } as unknown as MedusaRequest

    queryConfig = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      isList: true,
    }

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(mockRequest.listConfig).toEqual(
      expect.objectContaining({
        select: [
          "id",
          "created_at",
          "deleted_at",
          "metadata.id",
          "metadata.parent.id",
          "metadata.children.id",
          "metadata.product.id",
          "test_prop",
        ],
      })
    )
  })

  it(`should transform the input and manage the allowed fields and relations properly without error`, async () => {
    const restrictedFields = new RestrictedFields()
    let mockRequest = {
      restrictedFields,
      query: {
        fields: "product.*, *product.variants,+product.id",
      },
    } as unknown as MedusaRequest

    restrictedFields.add(["product"])

    const mockResponse = {} as MedusaResponse
    const nextFunction: MedusaNextFunction = jest.fn()

    let queryConfig: any = {
      defaults: [
        "id",
        "created_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      allowed: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
        "product",
        "product.variants",
      ],
      isList: true,
    }

    let middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(mockRequest.listConfig).toEqual(
      expect.objectContaining({
        select: [
          "id",
          "created_at",
          "deleted_at",
          "metadata.id",
          "metadata.parent.id",
          "metadata.children.id",
          "metadata.product.id",
          "product.id",
        ],
        relations: [
          "metadata",
          "metadata.parent",
          "metadata.children",
          "metadata.product",
          "product",
          "product.variants",
        ],
      })
    )
    expect(mockRequest.remoteQueryConfig).toEqual(
      expect.objectContaining({
        fields: [
          "id",
          "created_at",
          "deleted_at",
          "metadata.id",
          "metadata.parent.id",
          "metadata.children.id",
          "metadata.product.id",
          "product.id",
          "product.*",
          "product.variants.*",
        ],
      })
    )

    mockRequest = {
      ...mockRequest,
      query: {
        fields: "store.name",
      },
    } as unknown as MedusaRequest

    queryConfig = {
      defaults: [
        "id",
        "created_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      allowed: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
        "product",
        "product.variants",
        "store.name",
      ],
      isList: true,
    }

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(mockRequest.listConfig).toEqual(
      expect.objectContaining({
        select: ["store.name", "id"],
        relations: ["store"],
      })
    )
    expect(mockRequest.remoteQueryConfig).toEqual(
      expect.objectContaining({
        fields: ["store.name", "id"],
      })
    )
  })

  it("should throw when attempting to transform the input if disallowed fields are requested", async () => {
    let mockRequest = {
      restrictedFields: new RestrictedFields(),
      query: {
        fields: "+test_prop",
      },
    } as unknown as MedusaRequest
    const mockResponse = {} as MedusaResponse
    const nextFunction: MedusaNextFunction = jest.fn()

    let queryConfig: any = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      allowed: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      isList: true,
    }

    let middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenLastCalledWith(
      new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [test_prop] are not valid`
      )
    )

    mockRequest = {
      ...mockRequest,
      query: {
        fields: "product",
      },
    } as unknown as MedusaRequest

    queryConfig = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      allowed: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      isList: true,
    }

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenLastCalledWith(
      new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [product] are not valid`
      )
    )

    mockRequest = {
      ...mockRequest,
      query: {
        fields: "store",
      },
    } as unknown as MedusaRequest

    queryConfig = {
      defaults: [
        "id",
        "created_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      allowed: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
        "product",
        "product.variants",
        "store.name",
      ],
      isList: true,
    }

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenLastCalledWith(
      new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [store] are not valid`
      )
    )

    mockRequest = {
      ...mockRequest,
      query: {
        fields: "*product",
      },
    } as unknown as MedusaRequest

    queryConfig = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      allowed: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      isList: true,
    }

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenLastCalledWith(
      new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [product] are not valid`
      )
    )

    mockRequest = {
      ...mockRequest,
      query: {
        fields: "*product.variants",
      },
    } as unknown as MedusaRequest

    queryConfig = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      allowed: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
        "product",
      ],
      isList: true,
    }

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenLastCalledWith(
      new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [product.variants] are not valid`
      )
    )

    mockRequest = {
      ...mockRequest,
      query: {
        fields: "*product",
      },
    } as unknown as MedusaRequest

    queryConfig = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      allowed: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
        "product.title",
      ],
      isList: true,
    }

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenLastCalledWith(
      new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [product] are not valid`
      )
    )
  })

  it("should throw when attempting to transform the input if restricted fields are requested", async () => {
    const restrictedFields = new RestrictedFields()
    let mockRequest = {
      restrictedFields,
      query: {
        fields: "*product",
      },
    } as unknown as MedusaRequest

    restrictedFields.add(["product"])

    const mockResponse = {} as MedusaResponse
    const nextFunction: MedusaNextFunction = jest.fn()

    const queryConfig: QueryConfig<any> = {
      defaults: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      isList: true,
    }

    const middleware = validateAndTransformQuery(
      createFindParams(),
      queryConfig
    )

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenLastCalledWith(
      new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [metadata.product.id, product] are not valid`
      )
    )
  })
})
