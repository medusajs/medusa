import { NextFunction, Request, Response } from "express"
import { transformQuery } from "../transform-query"
import { extendedFindParamsMixin } from "../../../types/common"
import { MedusaError } from "medusa-core-utils"

describe("transformQuery", () => {
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
      relations,
    }: {
      offset: number
      limit: number
      inputOrder: string | undefined
      transformedOrder: Record<string, "ASC" | "DESC">
      relations?: string[]
    }) => {
      expect(mockRequest.validatedQuery).toEqual({
        offset,
        limit,
        order: inputOrder,
      })
      expect(mockRequest.filterableFields).toEqual({})
      expect(mockRequest.allowedProperties).toEqual([
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
        "metadata",
        "metadata.children",
        "metadata.parent",
        "metadata.product",
      ])
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
        relations: relations ?? [
          "metadata",
          "metadata.children",
          "metadata.parent",
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
        variables: {
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

    let middleware = transformQuery(extendedFindParamsMixin(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expectations({
      limit: 20,
      offset: 0,
      inputOrder: undefined,
      transformedOrder: {
        created_at: "DESC",
      },
    })

    //////////////////////////////

    mockRequest = {
      query: {
        limit: "10",
        offset: "5",
        order: "created_at",
      },
    } as unknown as Request

    middleware = transformQuery(extendedFindParamsMixin(), queryConfig)

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
      isList: true,
    }

    middleware = transformQuery(extendedFindParamsMixin(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expectations({
      limit: 10,
      offset: 5,
      inputOrder: "created_at",
      transformedOrder: { created_at: "ASC" },
      relations: [],
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

    let middleware = transformQuery(extendedFindParamsMixin(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(mockRequest.listConfig).toEqual(
      expect.objectContaining({
        select: ["id", "created_at"],
      })
    )

    //////////////////////////////

    mockRequest = {
      query: {
        fields: "+test_prop,-updated_at",
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
      isList: true,
    }

    middleware = transformQuery(extendedFindParamsMixin(), queryConfig)

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
      allowedFields: [
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

    let middleware = transformQuery(extendedFindParamsMixin(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith(
      new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [test_prop] are not valid`
      )
    )

    mockRequest = {
      query: {
        expand: "product",
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
      allowedFields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "metadata.id",
        "metadata.parent.id",
        "metadata.children.id",
        "metadata.product.id",
      ],
      allowedRelations: [
        "metadata",
        "metadata.parent",
        "metadata.children",
        "metadata.product",
      ],
      isList: true,
    }

    middleware = transformQuery(extendedFindParamsMixin(), queryConfig)

    await middleware(mockRequest, mockResponse, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith(
      new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Requested fields [product] are not valid`
      )
    )
  })
})
