import { NextFunction, Request, Response } from "express"
import { createFindParams } from "../validators"
import { validateAndTransformQuery } from "../validate-query"
import { MedusaError } from "@medusajs/utils"

describe("validateAndTransformQuery", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should transform the input query", async () => {
    let mockRequest = {
      query: {},
    } as Request
    const mockResponse = {} as Response
    const nextFunction: NextFunction = jest.fn()

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
      defaultFields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      defaultRelations: [
        "metadata",
        "metadata.parent",
        "metadata.children",
        "metadata.product",
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

    //////////////////////////////

    mockRequest = {
      query: {
        limit: "10",
        offset: "5",
        order: "created_at",
      },
    } as unknown as Request

    middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expectations({
      limit: 10,
      offset: 5,
      inputOrder: "created_at",
      transformedOrder: { created_at: "ASC" },
    })

    //////////////////////////////

    mockRequest = {
      query: {
        limit: "10",
        offset: "5",
        order: "created_at",
      },
    } as unknown as Request

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
      query: {
        fields: "id",
      },
    } as unknown as Request
    const mockResponse = {} as Response
    const nextFunction: NextFunction = jest.fn()

    let queryConfig: any = {
      defaultFields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      defaultRelations: [
        "metadata",
        "metadata.parent",
        "metadata.children",
        "metadata.product",
      ],
      isList: true,
    }

    let middleware = validateAndTransformQuery(createFindParams(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(mockRequest.listConfig).toEqual(
      expect.objectContaining({
        select: ["id", "created_at"],
      })
    )

    //////////////////////////////

    mockRequest = {
      query: {
        fields: "+test_prop,-prop-test-something",
      },
    } as unknown as Request

    queryConfig = {
      defaultFields: [
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
      defaultRelations: [
        "metadata",
        "metadata.parent",
        "metadata.children",
        "metadata.product",
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

    //////////////////////////////

    mockRequest = {
      query: {
        fields: "+test_prop,-updated_at",
      },
    } as unknown as Request

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
    let mockRequest = {
      query: {
        fields: "*product.variants,+product.id",
      },
    } as unknown as Request
    const mockResponse = {} as Response
    const nextFunction: NextFunction = jest.fn()

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
          "product.variants.*",
        ],
      })
    )

    //////////////////////////////

    mockRequest = {
      query: {
        fields: "store.name",
      },
    } as unknown as Request

    queryConfig = {
      defaultFields: [
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
        select: ["store.name", "created_at", "id"],
        relations: ["store"],
      })
    )
    expect(mockRequest.remoteQueryConfig).toEqual(
      expect.objectContaining({
        fields: ["store.name", "created_at", "id"],
      })
    )
  })

  it("should throw when attempting to transform the input if disallowed fields are requested", async () => {
    let mockRequest = {
      query: {
        fields: "+test_prop",
      },
    } as unknown as Request
    const mockResponse = {} as Response
    const nextFunction: NextFunction = jest.fn()

    let queryConfig: any = {
      defaultFields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      defaultRelations: [
        "metadata",
        "metadata.parent",
        "metadata.children",
        "metadata.product",
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

    //////////////////////////////

    mockRequest = {
      query: {
        fields: "product",
      },
    } as unknown as Request

    queryConfig = {
      defaultFields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      defaultRelations: [
        "metadata",
        "metadata.parent",
        "metadata.children",
        "metadata.product",
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

    //////////////////////////////

    mockRequest = {
      query: {
        fields: "store",
      },
    } as unknown as Request

    queryConfig = {
      defaultFields: [
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

    //////////////////////////////

    mockRequest = {
      query: {
        fields: "*product",
      },
    } as unknown as Request

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

    //////////////////////////////

    mockRequest = {
      query: {
        fields: "*product.variants",
      },
    } as unknown as Request

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

    //////////////////////////////

    mockRequest = {
      query: {
        fields: "*product",
      },
    } as unknown as Request

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
})
